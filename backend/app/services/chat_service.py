from app.repositories.chat_repository import ChatRepository

class ChatService:
    def __init__(self):
        self.chat_repository = ChatRepository()

    def get_chat_count(self):
        return self.chat_repository.get_chat_count()
    
    def get_chat_by_id(self, chat_id: int):
        return self.chat_repository.get_chat_by_id(chat_id)
    
    def create_chat(self, chat_data: dict):
        return self.chat_repository.create_chat(chat_data)
    
    def read_chats_by_user_id(self, user_id: int):
        return self.chat_repository.read_chats_by_user_id(user_id)
    
    def delete_chat(self, chat_id: int):
        return self.chat_repository.delete_chat(chat_id)
    
    def update_chat(self, chat_id: int, chat_data: dict):
        return self.chat_repository.update_chat(chat_id, chat_data)