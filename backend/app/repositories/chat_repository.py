from sqlalchemy import select, func

from app.models.chat import Chat
from db.config.session import SessionLocal

class ChatRepository:
    def __init__(self):
        self.session = SessionLocal()
    

    # Obtener cantidad de registros de chats
    def get_chat_count(self):
        try:
            stmt = select(func.count(Chat.id))
            return self.session.scalar(stmt)
        finally:
            self.session.close()
    
    # Obtener un chat a partir de su ID
    def get_chat_by_id(self, chat_id: int):
        try:
            stmt = select(Chat).where(Chat.id == chat_id)
            return self.session.scalar(stmt)
        finally:
            self.session.close()
    
    # Crear un chat nuevo
    def create_chat(self, chat_data: dict):
        try:
            nuevo_chat = Chat(**chat_data)
            self.session.add(nuevo_chat)
            self.session.commit()
            self.session.refresh(nuevo_chat)
            return nuevo_chat
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()
    
    # Obtener todos los chats de un usuario a partir de su ID
    def read_chats_by_user_id(self, user_id: int):
        try:
            stmt = select(Chat).where(Chat.id_usuario == user_id)
            return self.session.scalars(stmt).all()
        finally:
            self.session.close()
    

    # Eliminar un chat a partir de su ID
    def delete_chat(self, chat_id: int):
        try:
            stmt = select(Chat).where(Chat.id == chat_id)
            chat = self.session.scalar(stmt)
            if chat:
                self.session.delete(chat)
                self.session.commit()
                return True
            return False
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()
    
    # Actualizar un chat a partir de su ID
    def update_chat(self, chat_id: int, chat_data: dict):
        try:
            stmt = select(Chat).where(Chat.id == chat_id)
            chat = self.session.scalar(stmt)
            if chat:
                for key, value in chat_data.items():
                    setattr(chat, key, value)
                self.session.commit()
                self.session.refresh(chat)
                return chat
            return None
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()