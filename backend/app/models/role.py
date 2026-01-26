from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.config.base import base


class Rol(base):
    __tablename__ = "Roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), unique=True, nullable=False)

    usuarios = relationship("Usuario", back_populates="rol")
