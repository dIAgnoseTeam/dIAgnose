from sqlalchemy import select, func

from app.models.clinical_case import CasoClinico
from db.config.session import SessionLocal


class CaseRepository:
    def __init__(self):
        self.session = SessionLocal()

    # Obtener cantidad de registros de casos clínicos
    def get_case_count(self):
        try:
            stmt = select(func.count(CasoClinico.id))
            return self.session.scalar(stmt)
        finally:
            self.session.close()

    # Obtener un caso clínico a partir de su ID
    def get_case_by_id(self, case_id: int):
        try:
            stmt = select(CasoClinico).where(CasoClinico.id == case_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()
            
    # Crear un caso clinico nuevo
    def create_case(self, caso_data: dict):
        try:
            nuevo_caso = CasoClinico(**caso_data)
            self.session.add(nuevo_caso)
            self.session.commit()
            self.session.refresh(nuevo_caso)
            return nuevo_caso
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()
    
    # Comprobar que un caso clinico ya existe
    def case_exists(self, motivo: str, diagnostico_final: str, edad: int, sexo: str):
        try:
            stmt = select(CasoClinico).where(
                CasoClinico.motivo == motivo,
                CasoClinico.diagnostico_final == diagnostico_final,
                CasoClinico.edad == edad,
                CasoClinico.sexo == sexo
            )
            result = self.session.scalar(stmt)
            return result is not None
        finally:
            self.session.close()
