from sqlalchemy import select

from app.models.clinical_case import CasoClinico
from db.config.session import SessionLocal


class CaseRepository:
    def __init__(self):
        self.session = SessionLocal()

    # Obtener cantidad de registros de casos clínicos
    def get_case_count(self, limit: int = 1000, offset: int = 0):
        try:
            stmt = select(CasoClinico).limit(limit).offset(offset)
            return self.session.scalar(stmt).all()
        finally:
            self.session.close()

    # Obtener un caso clínico a partir de su ID
    def get_case_by_id(self, case_id: int):
        try:
            stmt = select(CasoClinico).where(CasoClinico.id == case_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()
