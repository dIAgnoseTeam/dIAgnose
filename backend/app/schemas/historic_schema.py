def historic_to_dict(historic):
    return {
        "id": historic.id,
        "id_chat": historic.id_chat,
        "rol": historic.rol,
        "mensaje": historic.mensaje,
        "fecha_creacion": historic.fecha_creacion.isoformat() if historic.fecha_creacion else None,
    }