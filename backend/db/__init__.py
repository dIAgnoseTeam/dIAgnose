from db.config import base, engine
from pathlib import Path
from app.models import Usuario, Valoracion, Rol, CasoClinico  # noqa: F401


def database_exists():
    db_path = Path(__file__).resolve().parent / "db.sqlite"
    return db_path.exists()


def init_database():
    if database_exists():
        print(
            "La base de datos ya existe. "
            "No se inicializará de nuevo la base de datos"
        )
        return False

    print("Inicializando la base de datos...")
    # Los modelos deben estar importados antes de hacer create_all
    base.metadata.create_all(bind=engine)

    print("Base de datos inicializada correctamente")
    return True
