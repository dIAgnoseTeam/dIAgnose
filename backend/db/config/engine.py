from sqlalchemy import create_engine
from pathlib import Path

# Apuntando a la carpeta de backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "db" / "db.sqlite"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"check_same_thread": False})