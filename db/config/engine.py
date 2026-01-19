from sqlalchemy import create_engine
from pathlib import Path

DB_DIR = Path(__file__).resolve().parent.parent
# URL que nos ayuda a tener compatibilidad en rutas de Windows, usar si es preciso
# DATABASE_URL = f"sqlite:///{(DB_DIR / 'db.sqlite').as_posix()}"
DATABASE_URL = f"sqlite:///{DB_DIR / 'db.sqlite'}"

engine = create_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"check_same_thread": False})