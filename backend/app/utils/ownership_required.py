def check_ownership_or_admin(current_user: dict, resource_owner_id: int) -> bool:
    """Función para verificar si el usuario actual es el propietario del recurso o un administrador."""
    is_admin = int(current_user.get("id_rol", 0)) == 1
    return is_admin or resource_owner_id == current_user.get("user_id")
