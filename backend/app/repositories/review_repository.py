from sqlalchemy import select, func

from app.models.review import Valoracion
from db.config.session import SessionLocal


class ReviewRepository:
    def __init__(self):
        self.session = SessionLocal()

    def get_all(self, limit: int = 100, offset: int = 0):
        try:
            stmt = select(Valoracion).limit(limit).offset(offset)
            return self.session.scalars(stmt).all()
        finally:
            self.session.close()

    def get_by_id(self, valoracion_id: int):
        try:
            stmt = select(Valoracion).where(Valoracion.id == valoracion_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()

    def get_by_user(self, user_id: int):
        try:
            stmt = select(Valoracion).where(Valoracion.id_usuario == user_id)
            return self.session.scalars(stmt).all()
        finally:
            self.session.close()

    def create(self, valoracion_dict: dict):
        try:
            nueva_valoracion = Valoracion(**valoracion_dict)
            self.session.add(nueva_valoracion)
            self.session.commit()
            self.session.refresh(nueva_valoracion)
            return nueva_valoracion
        finally:
            self.session.close()

    def count_reviews_by_case(self, case_id: int):
        try:
            stmt = select(func.count(Valoracion.id)).where(Valoracion.id_caso == case_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()

    def user_has_reviewed_case(self, user_id: int, case_id:int):
        try:
            stmt = select(Valoracion).where(Valoracion.id_usuario == user_id, Valoracion.id_caso == case_id)
            return self.session.scalar(stmt) is not None
        finally:
            self.session.close()
