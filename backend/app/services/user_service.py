from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()

    def get_all_users(self):
        return self.user_repository.get_all_users()

    def get_user_by_id(self, user_id: int):
        return self.user_repository.get_user_by_id(user_id)

    def get_user_by_email(self, correo: str):
        return self.user_repository.get_user_by_email(correo)

    def get_users_count(self):
        return self.user_repository.get_users_count()

    def create_or_update_user(self, correo: str, nombre: str):
        return self.user_repository.create_or_update(correo, nombre)

    def update_user(self, user_id: int, data: dict):
        return self.user_repository.update_user(user_id, data)

    def change_user_role(self, user_id: int, new_role: int):
        return self.user_repository.change_user_role(user_id, new_role)
