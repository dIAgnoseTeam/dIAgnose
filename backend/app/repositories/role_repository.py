from sqlalchemy import select, func
from app.models.role import Rol
from db.config.session import SessionLocal

class RoleRepository:
    def __init__(self):
        self.session = SessionLocal()
    
    def get_role_by_id(self, role_id: int):
        try:
            stmt = select(Rol).where(Rol.id == role_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()
    
    def get_roles_count(self):
        try:
            stmt = select(func.count(Rol.id))
            return self.session.scalar(stmt)
        finally:
            self.session.close()