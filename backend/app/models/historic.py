from sqlalchemy import Column, Integer, String, CheckConstraint, BLOB, Date
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from db.config.base import base

class Historicos(base):
    __tablename__ = "Historicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_chat = Column(Integer, ForeignKey("Chats.id"), nullable=False)
    rol = Column(String(10), CheckConstraint("rol IN ('user', 'assistant')"), nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    mensaje = Column(BLOB, nullable=False)

    chat = relationship("Chat", back_populates="historics")


