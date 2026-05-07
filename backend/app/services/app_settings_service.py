from app.repositories.appsettings_repository import AppSettingsRepository


class AppSettingsService:
    def __init__(self):
        self.appsettings_repository = AppSettingsRepository()

    def get_settings(self):
        return self.appsettings_repository.get_settings()

    def get_or_create(self):
        settings = self.get_settings()
        if not settings:
            settings = self.appsettings_repository.update_settings({"chat_enabled": False})
        return settings

    def update_settings(self, settings_data: dict):
        """Actualiza cualquier combinación de campos permitidos."""
        return self.appsettings_repository.update_settings(settings_data)

    def get_dashboard_stats(self):
        """Métricas agregadas de toda la plataforma para el panel admin."""
        return self.appsettings_repository.get_dashboard_stats()
