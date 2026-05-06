from sqlalchemy import select, func

from app.models.review import Valoracion
from app.models.user import Usuario
from db.config.session import SessionLocal
import logging


class ReviewRepository:
    def __init__(self):
        self.session = SessionLocal()

    def get_all(self, limit=10, offset=0, email=None, fecha=None, puntuacion=None):
        try:
            # Select con el join para obtener las valoraciones junto con la información del usuario
            stmt = select(Valoracion).join(Usuario, Valoracion.id_usuario == Usuario.id)
            # Count para obtener el total de valoraciones que cumplen con los filtros
            count_stmt = select(func.count(Valoracion.id)).join(Usuario, Valoracion.id_usuario == Usuario.id)
            
            if email is not None:
                stmt = stmt.where(Usuario.correo.like(f"%{email}%"))
                count_stmt = count_stmt.where(Usuario.correo.like(f"%{email}%"))
            if fecha is not None:
                stmt = stmt.where(Valoracion.fecha == fecha)
                count_stmt = count_stmt.where(Valoracion.fecha == fecha)
            if puntuacion is not None:
                stmt = stmt.where(Valoracion.puntuacion == puntuacion)
                count_stmt = count_stmt.where(Valoracion.puntuacion == puntuacion)
        
            return self.session.scalars(stmt.limit(limit).offset(offset)).all(), self.session.scalar(count_stmt)
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
    
    def get_stats(self):
        try:
            stmt = select(
                func.count(Valoracion.id).label("total"),
                func.avg(Valoracion.puntuacion).label("media"),
                func.min(Valoracion.puntuacion).label("minima"),
                func.max(Valoracion.fecha).label("mas_reciente"),
            )
            result = self.session.execute(stmt).one()
            return {
                "total":        result.total or 0,
                "media":        round(result.media, 1) if result.media else 0,
                "minima":       result.minima or 0,
                "mas_reciente": result.mas_reciente.isoformat() if result.mas_reciente else None,
            }
        finally:
            self.session.close()
