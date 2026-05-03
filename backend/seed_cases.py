import pandas as pd
from datasets import load_dataset
from db.config.session import SessionLocal
from app.models.clinical_case import CasoClinico
from app.services.case_service import CaseService
from app.config import Config
from tqdm import tqdm
import logging
import random

# Declaramos el servicio de casos
case_service = CaseService()


def load_hf_dataset() -> list[dict]:
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
    return df.to_dict("records")


def fetch_existing_keys(db) -> set[tuple]:
    rows = db.query(
        CasoClinico.motivo,
        CasoClinico.diagnostico_final,
        CasoClinico.edad,
        CasoClinico.sexo,
    ).all()
    return {(r.motivo, r.diagnostico_final, r.edad, r.sexo) for r in rows}


def process_batch(db, batch: list[dict]) -> None:
    db.bulk_insert_mappings(CasoClinico, batch)
    db.commit()


def seed_cases():
    # Desactivamos el debug de logging de sqlalchemy y huggingface
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

    # Creamos la conexion a la DB
    db = SessionLocal()

    # Variables de configuracion
    CASOS_PERMITIDOS = 1000
    TAMANIO_LOTE = 250
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
    ]

    try:
        # Saber cuantos casos hay actualmente en la base de datos
        total_en_db = db.query(CasoClinico).count()
        faltan = CASOS_PERMITIDOS - total_en_db

        if faltan <= 0:
            logging.info(f"DB ya tiene {total_en_db} casos (≥ {CASOS_PERMITIDOS}). Nada que hacer.")
            return

        logging.info(f"DB tiene {total_en_db} casos. Faltan {faltan} para llegar a {CASOS_PERMITIDOS}.")

        # Cargamos el dataset completo
        logging.info("Cargando dataset desde Hugging Face...")
        casos_hf = load_hf_dataset()
        logging.info(f"{len(casos_hf)} casos disponibles en HuggingFace.")

        # Obtenemos las claves ya existentes para no duplicar
        existing_keys = fetch_existing_keys(db)

        # Filtramos los casos que no están en la DB
        casos = [
            caso
            for caso in casos_hf
            if (caso.get("motivo", ""), caso.get("diagnostico_final", ""), caso.get("edad"), caso.get("sexo", ""))
            not in existing_keys
        ]

        logging.info(f"{len(casos)} casos nuevos disponibles para insertar.")

        if not casos:
            logging.info("No hay casos nuevos. Seed finalizado.")
            return

        # Seleccionamos aleatoriamente solo los que faltan
        random.seed(RANDOM_SEED)
        muestra = random.sample(casos, min(faltan, len(casos)))

        nuevos = [{field: caso.get(field) for field in CASE_FIELDS} for caso in muestra]

        logging.info(f"Insertando {len(nuevos)} casos nuevos en lotes de {TAMANIO_LOTE}...")
        for i in tqdm(range(0, len(nuevos), TAMANIO_LOTE), desc="Insertando lotes"):
            process_batch(db, nuevos[i : i + TAMANIO_LOTE])

        total_final = db.query(CasoClinico).count()
        logging.info(f"Seed completado. Insertados: {len(nuevos)} | Total en DB: {total_final}")

    except Exception as e:
        logging.error(f"Error al sembrar casos: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_cases()
