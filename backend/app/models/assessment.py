from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.config.base import base 

class Valoracion(base):
    __tablename__ = 'Valoraciones'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuarios.id'), nullable=False)
    puntuacion = Column(Integer, nullable=False)
    mensaje = Column(String(255), nullable=True)

    usuario = relationship("Usuario", back_populates="valoraciones")