import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Ruta base del proyecto (carpeta backend)
BASE_DIR = Path(__file__).resolve().parent.parent  # Sube dos niveles desde app/config.py
DB_PATH = BASE_DIR / "db" / "db.sqlite"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

    # Hugging Face Token
    HF_TOKEN = os.getenv("HF_TOKEN", None)
    HF_CACHE_DIR = os.getenv("HF_CACHE_DIR", "./hf_cache")

    # Auth Configurations
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)

    # Docker configurations
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

    GOOGLE_DESCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
    OAUTH_SCOPES = ["openid", "email", "profile"]
