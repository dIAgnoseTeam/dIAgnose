def chat_to_dict(chat):
    return {
        "id": chat.id,
        "id_usuario": chat.id_usuario,
        "titulo": chat.titulo,
        "fecha_creacion": chat.fecha_creacion.isoformat() if chat.fecha_creacion else None,
        "activo": chat.activo
    }