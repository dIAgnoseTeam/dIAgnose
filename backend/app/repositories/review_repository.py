from sqlalchemy import select

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
