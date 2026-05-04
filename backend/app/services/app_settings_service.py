from app.repositories.appsettings_repository import AppSettingsRepository  

class AppSettingsService:
    def __init__(self):
        self.appsettings_repository = AppSettingsRepository()
    
    def get_settings(self):
        return self.appsettings_repository.get_settings()
    
    def update_settings(self, settings_data: dict):
        return self.appsettings_repository.update_settings(settings_data)