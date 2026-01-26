from sqlalchemy import select, func
from app.models.user import Usuario
from db.config.session import SessionLocal

class UserRepository:
    def __init__(self):
        self.session = SessionLocal()
    
    def get_user_by_id(self, user_id: int):
        try:
            stmt = select(Usuario).where(Usuario.id == user_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()
    
    def get_users_count(self):
        try:
            stmt = select(func.count(Usuario.id))
            return self.session.scalar(stmt)
        finally:
            self.session.close()
    
    def create_or_update(self, correo: str, nombre: str, id_rol: int = 3):
        session = SessionLocal()
        try:
            # Buscar usuario existente
            stmt = select(Usuario).where(Usuario.correo == correo)
            user = session.scalar(stmt)
            
            if user:
                # Actualizar nombre si cambió
                user.nombre = nombre
            else:
                # Crear nuevo usuario con rol por defecto (3 = usuario normal)
                user = Usuario(correo=correo, nombre=nombre, id_rol=id_rol)
                session.add(user)
            
            session.commit()
            session.refresh(user)
            return user
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()