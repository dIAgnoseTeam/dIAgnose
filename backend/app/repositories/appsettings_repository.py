from sqlalchemy import select, func

from app.models.app_settings import AppSettings
from db.config.session import SessionLocal


class AppSettingsRepository:

    # Obtener app settings
    @staticmethod
    @staticmethod
    def get_settings():
        with SessionLocal() as s:
            return s.execute(select(AppSettings)).scalar_one_or_none()

    # Actualizar app settings
    @staticmethod
    def update_settings(settings_data: dict):
        with SessionLocal() as s:
            settings = s.execute(select(AppSettings)).scalar_one_or_none()
            if settings:
                settings.chat_enabled = bool(settings_data.get("chat_enabled", settings.chat_enabled))
            else:
                settings = AppSettings(chat_enabled=bool(settings_data.get("chat_enabled", False)))
                s.add(settings)
            s.commit()
            s.refresh(settings)
            return settings
