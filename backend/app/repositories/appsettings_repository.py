from sqlalchemy import select, func

from app.models.app_settings import AppSettings
from db.config.base import session

class AppSettingsRepository:
    
    # Obtener app settings
    @staticmethod
    def get_settings():
        """Obtener app settings."""
        with session() as s:
            settings = s.execute(select(AppSettings)).scalar_one_or_none()
            return settings

    # Actualizar app settings
    @staticmethod
    def update_settings(new_settings: AppSettings):
        """Actualizar app settings"""
        with session() as s:
            existing_settings = s.execute(select(AppSettings)).scalar_one_or_none()
            if existing_settings:
                existing_settings.chat_enabled = new_settings.chat_enabled
                s.commit()
            else:
                s.add(new_settings)
                s.commit()