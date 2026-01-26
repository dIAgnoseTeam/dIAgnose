from sqlalchemy.orm import sessionmaker
from .engine import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Función que hace de generador para obtener una sesión de la base de datos
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()