from sqlalchemy import select
from db.config.session import SessionLocal
from app.models.user import Usuario


class UserService:
    def __init__(self):
        self.session = SessionLocal()
    
    def create_or_update_user(self, correo: str, nombre: str, id_rol: int = 2) -> Usuario:
        try:
            # Buscamos al usuario si existe
            stmt = select(Usuario).where(Usuario.correo == correo)
            usuario_existente = self.session.scalar(stmt)
            
            if usuario_existente:
                # El usuario existe, actualizamos el nombre si ha cambiado
                usuario_existente.nombre = nombre
                self.session.commit()
                self.session.refresh(usuario_existente)  # Refrescar antes de cerrar
                return usuario_existente
            else:
                # Si el usuario no existe, lo creamos
                nuevo_usuario = Usuario(nombre=nombre, correo=correo, id_rol=id_rol)
                self.session.add(nuevo_usuario)
                self.session.commit()
                self.session.refresh(nuevo_usuario)  # Refrescar antes de cerrar
                return nuevo_usuario
        finally:
            self.session.close()
