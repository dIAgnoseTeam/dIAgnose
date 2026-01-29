import pandas as pd
from datasets import load_dataset
from sqlalchemy.orm import Session
from db.config.session import SessionLocal
from app.models.clinical_case import CasoClinico
from app.services.case_service import CaseService
from app.config import Config
from tqdm import tqdm
import logging

# Declaramos el servicio de casos
case_service = CaseService()

def seed_cases():
    # Desactivamos el debug de logging de sqlalchemy y huggingface
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    
    # Creamos la conexion a la DB
    db = SessionLocal()
    
    try:
        # Hacemos login con hf con token si existe
        if Config.HF_TOKEN:
            from huggingface_hub import login
            login(token=Config.HF_TOKEN)
            logging.info("Autenticado con Hugging Face")
        
        # Cargamos el dataset
        logging.info("Cargando dataset desde Hugging Face...")
        dataset = load_dataset("ilopezmon/casos_clinicos_completos")
        
        # Convertimos los splits a un solo DataFrame
        df_list = []
        for split in dataset.keys():
            temp_df = dataset[split].to_pandas()
            temp_df["split"] = split
            df_list.append(temp_df)
        
        df = pd.concat(df_list, ignore_index=True)
        casos_hf = df.to_dict('records')
        
        logging.info(f"Se encontraron {len(casos_hf)} casos en el dateset de Huggin Face")
        
        # Contamos los registros insertados
        casos_insertados = 0
        casos_omitidos = 0
        
        logging.info("Procesando casos (verificando duplicados e insertando)...")
        logging.info("")
        
        # Recorremos el dataset para insertar con barra de progreso
        for caso in tqdm(casos_hf, desc="   Progreso", unit=" caso", ncols=70, 
                         bar_format='{desc}: {percentage:3.0f}%|{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'):
            # Verificamos si el caso ya existe
            existe = case_service.case_already_exists(
                motivo=caso.get('motivo', ''),
                diagnostico_final=caso.get('diagnostico_final', ''),
                edad=caso.get('edad'),
                sexo=caso.get('sexo', '')
            )
            
            if not existe:
                caso_data = {
                'alergias': caso.get('alergias'),
                'antecedentes_familiares': caso.get('antecedentes_familiares'),
                'antecedentes_medicos': caso.get('antecedentes_medicos'),
                'antecedentes_quirurgicos': caso.get('antecedentes_quirurgicos'),
                'categoria': caso.get('categoria'),
                'diagnostico_final': caso.get('diagnostico_final'),
                'dificultad': caso.get('dificultad'),
                'edad': caso.get('edad'),
                'exploracion_general': caso.get('exploracion_general'),
                'factores_sociales': caso.get('factores_sociales'),
                'habitos': caso.get('habitos'),
                'medicacion_actual': caso.get('medicacion_actual'),
                'motivo': caso.get('motivo'),
                'razonamiento_clinico': caso.get('razonamiento_clinico'),
                'resultados_pruebas': caso.get('resultados_pruebas'),
                'sexo': caso.get('sexo'),
                'signos': caso.get('signos'),
                'sintomas': caso.get('sintomas'),
                'situacion_basal': caso.get('situacion_basal'),
                'tratamiento_farmacologico': caso.get('tratamiento_farmacologico'),
                'tratamiento_no_farmacologico': caso.get('tratamiento_no_farmacologico'),
                }
            
                # Crear el caso
                nuevo_caso = CasoClinico(**caso_data)
                db.add(nuevo_caso)
                casos_insertados += 1
            else:
                casos_omitidos += 1      
                
        # Commit de todos los casos
        db.commit()
        logging.info(f"Casos insertados: {casos_insertados}, Casos omitidos (ya existentes): {casos_omitidos}")
        
        # Mostramos la cantidad de todos los casos en la bd
        total_casos_db = db.query(CasoClinico).count()
        logging.info(f"Número total de casos en la base de datos: {total_casos_db}")
        
    except Exception as e:
        logging.error(f"Error al sembrar casos clínicos: {str(e)}")
        db.rollback()
        raise

    finally:
        db.close()
            

if __name__ == "__main__":
    seed_cases()