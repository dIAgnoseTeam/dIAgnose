from sqlalchemy.orm import Session
from db.config.session import SessionLocal
from app.models.role import Rol

def seed_roles():
    db = SessionLocal()
    try:
        # Verificar si ya existen roles
        roles_existentes = db.query(Rol).count()
        
        if roles_existentes == 0:
            # Crear los roles predefinidos
            roles = [
                Rol(id=1, nombre='admin'),
                Rol(id=2, nombre='usuario'),
                Rol(id=3, nombre='moderador'),
            ]
            
            db.add_all(roles)
            db.commit()
            print("Roles creados exitosamente")
        else:
            print("Los roles ya existen en la base de datos")
    
    except Exception as e:
        db.rollback()
        print(f"Error al crear roles: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()