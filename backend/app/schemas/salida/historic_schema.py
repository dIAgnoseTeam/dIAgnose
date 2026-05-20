from marshmallow import Schema, fields, validate

class CreateHistoricSchema(Schema):
    id_chat = fields.Int(required=True)
    rol = fields.Str(required=True, validate=validate.OneOf(["user", "assistant", "system"]))
    mensaje = fields.Str(required=True)

class UpdateHistoricSchema(Schema):
    id_chat = fields.Int(required=False)
    rol = fields.Str(required=False, validate=validate.OneOf(["user", "assistant", "system"]))
    mensaje = fields.Str(required=False)

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
