from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, CheckConstraint, BLOB
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from db.config.base import base


class Historicos(base):
    __tablename__ = "Historicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_chat = Column(Integer, ForeignKey("Chats.id"), nullable=False)
    rol = Column(String(10), CheckConstraint("rol IN ('user', 'assistant')"), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    mensaje = Column(BLOB, nullable=False)

    chat = relationship("Chat", back_populates="historics")
