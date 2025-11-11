from app.repositories.dataset_repository import DatasetRepository


class DatasetService:
    def __init__(self):
        self.dataset_repository = DatasetRepository()

    def get_registro(self, num: int) -> dict:
        return self.dataset_repository.get_registro(num)
