from db.config import base, engine, get_db_session
import os
import sys
from sqlalchemy import inspect
from pathlib import Path
from app.models import Usuario, Valoracion, Rol, CasoClinico

# Verificar si la base de datos existe
def database_exists():
    db_path = Path(__file__).resolve().parent / "db.sqlite"
    return db_path.exists()

# Inicializar la base de datos solo si no existe
def init_database():
    if database_exists():
        print("La base de datos ya existe. No se inicializará de nuevo la base de datos")
        return False
    
    print("Inicializando la base de datos...")
    # Ejecutar desde la raíz del proyecto
    # Los modelos deben estar importados antes de hacer create_all
    base.metadata.create_all(bind=engine)
    
    print("Base de datos inicializada correctamente")
    return True
