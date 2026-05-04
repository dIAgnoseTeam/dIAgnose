from sqlalchemy import Column, Integer, String, Date, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from db.config.base import base

class Chat(base):
    __tablename__ = "Chats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("Usuarios.id"), nullable=False)
    titulo = Column(String(50), nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    activo = Column(String(1), CheckConstraint("activo IN ('T', 'F')"), nullable=False)

    usuario = relationship("Usuario", back_populates="chats")
    historics = relationship("Historicos", back_populates="chat")
