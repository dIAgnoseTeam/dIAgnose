from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.config.base import base


class Usuario(base):
    __tablename__ = "Usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    id_rol = Column(Integer, ForeignKey("Roles.id"), nullable=False)

    rol = relationship("Rol", back_populates="usuarios")
    valoraciones = relationship("Valoracion", back_populates="usuario")
