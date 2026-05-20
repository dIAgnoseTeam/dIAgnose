from marshmallow import Schema, fields, validate

class CreateChatSchema(Schema):
    id_usuario = fields.Int(required=True)
    titulo = fields.Str(required=False, validate=validate.Length(max=255))
    activo = fields.Bool(required=False, load_default='T')

class UpdateChatSchema(Schema):
    titulo = fields.Str(required=False, validate=validate.Length(max=255))
    activo = fields.Bool(required=False)

class ChatMessageSchema(Schema):
    message = fields.Str(required=True, validate=validate.Length(min=1))

def chat_to_dict(chat):
    return {
        "id": chat.id,
        "id_usuario": chat.id_usuario,
        "titulo": chat.titulo,
        "fecha_creacion": chat.fecha_creacion.isoformat() if chat.fecha_creacion else None,
        "activo": chat.activo
    }