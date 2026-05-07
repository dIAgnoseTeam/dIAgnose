import pandas as pd
from datasets import load_dataset
from db.config.session import SessionLocal
from app.models.clinical_case import CasoClinico
from app.services.case_service import CaseService
from app.config import Config
from tqdm import tqdm
from sqlalchemy import func
import logging
import random

# Configuracion
 # Variables de configuracion
CASOS_POR_GRUPO = 20
TAMANIO_LOTE = 50
RANDOM_SEED = 42

CASE_FIELDS = [
        "alergias",
        "antecedentes_familiares",
        "antecedentes_medicos",
        "antecedentes_quirurgicos",
        "categoria",
        "diagnostico_final",
        "dificultad",
        "edad",
        "exploracion_general",
        "factores_sociales",
        "habitos",
        "medicacion_actual",
        "motivo",
        "razonamiento_clinico",
        "resultados_pruebas",
        "sexo",
        "signos",
        "sintomas",
        "situacion_basal",
        "tratamiento_farmacologico",
        "tratamiento_no_farmacologico",
        "agente",
        "referencias_bibliograficas",
        "keywords",
        "codigo_cie_10",
    ]

# Funciones auxiliares

def load_hf_dataset() -> pd.DataFrame:
    # Hacemos login con hf con token si existe
    if Config.HF_TOKEN:
        from huggingface_hub import login

        login(token=Config.HF_TOKEN)
        logging.info("Autenticado con Hugging Face")

    # Cargamos el dataset
    logging.info("Cargando dataset desde Hugging Face...")
    dataset = load_dataset("ilopezmon/casos_clinicos_completos")

    # Convertimos los splits a un solo DataFrame
    df = pd.concat([dataset[split].to_pandas() for split in dataset.keys()], ignore_index=True)
    return df


def fetch_existing_keys(db) -> set[tuple]:
    rows = db.query(
        CasoClinico.motivo,
        CasoClinico.diagnostico_final,
        CasoClinico.edad,
        CasoClinico.sexo,
    )
    return {(r.motivo, r.diagnostico_final, r.edad, r.sexo) for r in rows}

def fetch_group_counts(db) -> dict[tuple, int]:
    dificultad_normalizada = func.lower(func.trim(CasoClinico.dificultad))
    rows = db.query(
        CasoClinico.agente,
        dificultad_normalizada.label("dificultad"),
    ).filter(
        dificultad_normalizada.in_(["facil", "fácil", "media", "dificil", "difícil"])
    ).all()
    
    counts = {}
    
    for r in rows:
        key = (r.agente, r.dificultad)
        counts[key] = counts.get(key, 0) + 1
    return counts

def process_batch(db, batch: list[dict]) -> None:
    db.bulk_insert_mappings(CasoClinico, batch)
    db.commit()
    
def fix_encoding(value):
    if not isinstance(value, str):
        return value
    try:
        return value.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value

def fix_case_encoding(caso: dict) -> dict:
    return {k: fix_encoding(v) for k, v in caso.items()}


def seed_cases():
    # Desactivamos el debug de logging de sqlalchemy y huggingface
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

    # Creamos la conexion a la DB
    db = SessionLocal()

    try:
        
        # Saber cuantos casos hay actualmente en la base de datos
        total_en_db = db.query(CasoClinico).count()
        faltan = CASOS_POR_GRUPO - total_en_db

        logging.info(f"DB tiene {total_en_db} casos cargados actualmente.")

        # Cargar dataset desde Hugging Face
        logging.info("Cargando dataset desde Hugging Face...")
        df = load_hf_dataset()
        logging.info(f"{len(df)} casos disponibles en HuggingFace.")
        
        # Normalizamos los casos para validar que las columnas necesarias existen
        for col in ("agente", "dificultad"):
            if col not in df.columns:
                logging.warning(f"Columna '{col}' no encontrada en dataset. Se asignará 'desconocido' por defecto.")
                raise ValueError(f"Columna '{col}' no encontrada en dataset.")

        # Controlados de nulos sin agente o dificultad
        df = df.dropna(subset=["agente", "dificultad"])
        # Normalizar y filtrar dificultad para evitar valores fuera de regla (ej. "f")
        df["dificultad"] = df["dificultad"].astype(str).str.strip().str.lower()
        df = df[df["dificultad"].isin(["facil", "fácil", "media", "dificil", "difícil"])]

        # Obtenemos las claves ya existentes para no duplicar
        existing_keys = fetch_existing_keys(db)
        group_counts = fetch_group_counts(db)
        
        grupos = df.groupby(["agente", "dificultad"], sort=True)
        logging.info(f"Grupos encontrados en dataset: {list(grupos.groups.keys())}")
        
        # Por cada grupo, seleccionar los casos faltantes
        nuevos_total = []    
            
        for (agente, dificultad), grupo_df in grupos:
            count_en_db = group_counts.get((agente, dificultad), 0)
            faltan_grupo = max(0, CASOS_POR_GRUPO - count_en_db)
            
            if faltan_grupo <= 0:
                logging.info(f"Grupo ({agente}, {dificultad}) ya tiene {count_en_db} casos (≥ {CASOS_POR_GRUPO}).")
                continue
            
            logging.info(f"Grupo ({agente}, {dificultad}): {len(grupo_df)} casos en HF, {count_en_db} en DB, faltan {faltan_grupo}.")

            # Filtramos los casos del grupo que no están en la DB
            mask = grupo_df.apply(
                lambda r: (
                    r.get("motivo"),
                    r.get("diagnostico_final"),
                    r.get("edad"),
                    r.get("sexo"),
                )
                not in existing_keys,
                axis=1,
            )
            
            disponibles = grupo_df[mask]
            
            if disponibles.empty:
                logging.warning(f"No hay casos nuevos disponibles para el grupo ({agente}, {dificultad}).")
                continue
            
            # Muestreo uniforme
            n_muestra = min(faltan_grupo, len(disponibles))
            muestra = disponibles.sample(n=n_muestra, random_state=RANDOM_SEED)
            
            logging.info(
                f"[{agente} | {dificultad}] En DB: {count_en_db} | "
                f"Disponibles: {len(disponibles)} | A insertar: {n_muestra}"
            )
            
            nuevos_total.extend(
                [{field: caso.get(field) for field in CASE_FIELDS} for _, caso in muestra.iterrows()]
            )
        # Insercion en lotes
        if not nuevos_total:
            logging.info("No hay casos nuevos para insertar después de procesar todos los grupos. Seed finalizado.")
            return
        
        logging.info(f"Total de casos nuevos a insertar después de procesar grupos: {len(nuevos_total)}. Insertando en lotes de {TAMANIO_LOTE}...")
        for i in tqdm(range(0, len(nuevos_total), TAMANIO_LOTE), desc="Insertando lotes"):
            batch = nuevos_total[i : i + TAMANIO_LOTE]
            batch_fixed = [fix_case_encoding(caso) for caso in batch]
            process_batch(db, batch_fixed)
        
        # Total final
        total_final = db.query(CasoClinico).count()
        logging.info(f"Seed completado. Insertados: {len(nuevos_total)} | Total en DB: {total_final}")
            
    except Exception as e:
        logging.error(f"Error al sembrar casos: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_cases()
