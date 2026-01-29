from app.repositories.case_repository import CaseRepository


class CaseService:
    def __init__(self):
        self.case_repository = CaseRepository()

    def get_case_by_id(self, case_id: int):
        return self.case_repository.get_case_by_id(case_id)

    def get_case_count(self):
        return self.case_repository.get_case_count()
    
    def create_new_case(self, caso_data: dict):
        return self.case_repository.create_case(caso_data)
    
    def case_already_exists(self, motivo: str, diagnostico_final: str, edad: int, sexo: str):
        return self.case_repository.case_exists(motivo, diagnostico_final, edad, sexo)
