from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.config.base import base


class CasoClinico(base):
    __tablename__ = "CasosClinicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    alergias = Column(String(255), nullable=True)
    antecedentes_familiares = Column(String(255), nullable=True)
    antecedentes_medicos = Column(String(255), nullable=True)
    antecedentes_quirurgicos = Column(String(255), nullable=True)
    categoria = Column(String(100), nullable=True)
    diagnostico_final = Column(String(255), nullable=True)
    dificultad = Column(String(100), nullable=True)
    edad = Column(Integer, nullable=True)
    exploracion_general = Column(String(255), nullable=True)
    factores_sociales = Column(String(255), nullable=True)
    habitos = Column(String(255), nullable=True)
    medicacion_actual = Column(String(255), nullable=True)
    motivo = Column(String(255), nullable=True)
    razonamiento_clinico = Column(String(255), nullable=True)
    resultados_pruebas = Column(String(255), nullable=True)
    sexo = Column(String(10), nullable=True)
    signos = Column(String(255), nullable=True)
    sintomas = Column(String(255), nullable=True)
    situacion_basal = Column(String(255), nullable=True)
    tratamiento_farmacologico = Column(String(255), nullable=True)
    tratamiento_no_farmacologico = Column(String(255), nullable=True)
