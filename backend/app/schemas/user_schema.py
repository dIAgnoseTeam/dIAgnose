def user_to_dict(user):
    return {
        "id": user.id,
        "nombre": user.nombre,
        "correo": user.correo,
        "id_rol": user.id_rol,
    }