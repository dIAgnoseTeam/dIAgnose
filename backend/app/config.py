import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Ruta base del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "db" / "db.sqlite"


class Config:
    # Seguridad
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # Base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

    # Hugging Face
    HF_TOKEN = os.getenv("HF_TOKEN", None)
    HF_CACHE_DIR = os.getenv("HF_CACHE_DIR", "./hf_cache")

    # OAuth / Auth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    # Frontend / Backend URLs
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

    # OAuth provider
    GOOGLE_DESCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )

    OAUTH_SCOPES = ["openid", "email", "profile"]

    # IA externa
    AI_API_URL = os.getenv(
        "AI_API_URL", "http://cloud.riberadeltajo.es:11200/generate"
    )

    @classmethod
    def validate(cls):
        required = ["SECRET_KEY", "JWT_SECRET_KEY"]
        missing = [name for name in required if not getattr(cls, name)]
        if missing:
            raise RuntimeError(
                f"Faltan variables de entorno requeridas: {', '.join(missing)}"
            )
