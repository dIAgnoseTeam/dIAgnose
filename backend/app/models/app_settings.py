from sqlalchemy import Column, Boolean, Integer
from sqlalchemy.orm import relationship

from db.config.base import base


class AppSettings(base):
    __tablename__ = "AppSettings"

    id = Column(Integer, primary_key=True, index=True)

    # Control de revisiones
    reviews_enabled = Column(Boolean, default=False, nullable=False)
    max_reviews_per_case = Column(Integer, default=3, nullable=False)
    # Modo de mantenimiento
    maintenance_mode = Column(Boolean, default=False, nullable=False)
    # Control de registro de nuevos usuarios
    allow_new_users = Column(Boolean, default=True, nullable=False)

    # Control del chat
    chat_enabled = Column(Boolean, default=False, nullable=False)
