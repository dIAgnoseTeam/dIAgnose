def historic_to_dict(historic):
    mensaje = historic.mensaje
    if isinstance(mensaje, (bytes, bytearray, memoryview)):
        try:
            mensaje = bytes(mensaje).decode("utf-8")
        except Exception:
            mensaje = bytes(mensaje).decode("utf-8", errors="replace")

    return {
        "id": historic.id,
        "id_chat": historic.id_chat,
        "rol": historic.rol,
        "mensaje": mensaje,
        "fecha_creacion": historic.fecha_creacion.isoformat() if historic.fecha_creacion else None,
    }
