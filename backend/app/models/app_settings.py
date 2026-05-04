from sqlalchemy import Column, Boolean, Integer
from sqlalchemy.orm import relationship

from db.config.base import base


class AppSettings(base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    chat_enabled = Column(Boolean, default=False, nullable=False)