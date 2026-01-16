from app.repositories.dataset_repository import DatasetRepository


class DatasetService:
    def __init__(self):
        self.dataset_repository = DatasetRepository()

    def get_registro(self, num: int) -> dict:
        return self.dataset_repository.get_registro(num)

    def get_max_registers(self) -> dict:
        return self.dataset_repository.get_max_register()
