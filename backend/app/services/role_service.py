from app.repositories.role_repository import RoleRepository

class RoleService:
    def __init__(self):
        self.role_repository = RoleRepository()

    def get_role_by_id(self, role_id: int):
        return self.role_repository.get_role_by_id(role_id)

    def get_roles_count(self):
        return self.role_repository.get_roles_count()