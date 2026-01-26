from app.repositories.case_repository import CaseRepository


class CaseService:
    def __init__(self):
        self.case_repository = CaseRepository()

    def get_case_by_id(self, case_id: int):
        return self.case_repository.get_case_by_id(case_id)

    def get_case_count(self, limit: int = 1000, offset: int = 0):
        return self.case_repository.get_case_count(limit, offset)
