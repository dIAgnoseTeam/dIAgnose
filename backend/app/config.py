import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///site.db")

    # Hugging Face Token
    HF_TOKEN = os.getenv("HF_TOKEN", None)
    HF_CACHE_DIR = os.getenv("HF_CACHE_DIR", "./hf_cache")
