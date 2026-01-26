from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()
    
    def get_user_by_id(self, user_id: int):
        return self.user_repository.get_user_by_id(user_id)

    def get_users_count(self):
        return self.user_repository.get_users_count()
    
    def create_or_update_user(self, correo: str, nombre: str):
        return self.user_repository.create_or_update(correo, nombre)