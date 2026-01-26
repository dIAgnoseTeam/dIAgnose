from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.config.base import base


#   Precisión diagnóstica
#   Claridad textual
#   Relevancia clínica
#   Adecuación contextual
#   Nivel técnico adecuado
class Valoracion(base):
    __tablename__ = "Valoraciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("Usuarios.id"), nullable=False)
    puntuacion = Column(Integer, nullable=False)
    mensaje = Column(String(255), nullable=True)
    precision_diagnostica = Column(Integer, nullable=False)
    claridad_textual = Column(Integer, nullable=False)
    relevancia_clinica = Column(Integer, nullable=False)
    adecuacion_contextual = Column(Integer, nullable=False)
    nivel_tecnico = Column(Integer, nullable=False)

    usuario = relationship("Usuario", back_populates="valoraciones")
