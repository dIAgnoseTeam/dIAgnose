from .config import base, engine, get_db_session
import sys
from pathlib import Path
from backend.models import Usuario, Valoracion, Rol, CasoClinico

def init_db():
    # Ejecutar desde la raíz del proyecto
    # Los modelos deben estar importados antes de hacer create_all
    base.metadata.create_all(bind=engine)