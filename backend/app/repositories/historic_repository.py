from sqlalchemy import select, func

from app.models.historic import Historicos
from db.config.session import SessionLocal


class HistoricoRepository:
    def __init__(self):
        self.session = SessionLocal()

    # Obtener cantidad de registros de historicos
    def get_historico_count(self):
        try:
            stmt = select(func.count(Historicos.id))
            return self.session.scalar(stmt)
        finally:
            self.session.close()

    # Obtener un historico a partir de su ID
    def get_historico_by_id(self, historico_id: int):
        try:
            stmt = select(Historicos).where(Historicos.id == historico_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()

    # Crear un historico nuevo
    def create_historico(self, historico_data: dict):
        try:
            mensaje = historico_data.get("mensaje")
            if isinstance(mensaje, str):
                historico_data["mensaje"] = mensaje.encode("utf-8")

            nuevo_historico = Historicos(**historico_data)
            self.session.add(nuevo_historico)
            self.session.commit()
            self.session.refresh(nuevo_historico)
            return nuevo_historico
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()

    # Obtener todos los historicos de un chat a partir de su ID
    def read_historicos_by_chat_id(self, chat_id: int):
        try:
            stmt = select(Historicos).where(Historicos.id_chat == chat_id)
            return self.session.scalars(stmt).all()
        finally:
            self.session.close()

    # Eliminar un historico a partir de su ID
    def delete_historico(self, historico_id: int):
        try:
            stmt = select(Historicos).where(Historicos.id == historico_id)
            historico = self.session.scalar(stmt)
            if historico:
                self.session.delete(historico)
                self.session.commit()
                return True
            return False
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()

    # Actualizar un historico a partir de su ID
    def update_historico(self, historico_id: int, update_data: dict):
        try:
            stmt = select(Historicos).where(Historicos.id == historico_id)
            historico = self.session.scalar(stmt)
            if historico:
                if "mensaje" in update_data and isinstance(update_data["mensaje"], str):
                    update_data["mensaje"] = update_data["mensaje"].encode("utf-8")

                for key, value in update_data.items():
                    setattr(historico, key, value)
                self.session.commit()
                self.session.refresh(historico)
                return historico
            return None
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()
