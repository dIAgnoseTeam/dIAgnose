from marshmallow import Schema, fields, validate


class CreateChatSchema(Schema):
    titulo = fields.String(required=False, validate=validate.Length(max=200))
    id_usuario = fields.Int(required=False)
    activo = fields.String(required=False, load_default='T')

    class Meta:
        unknown = "exclude"


class UpdateChatSchema(Schema):
    titulo = fields.String(
        required=False,
        validate=validate.Length(min=1, max=200)
    )

    contexto = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=10000),
    )

    class Meta:
        unknown = "exclude"


class SendChatMessageSchema(Schema):
    message = fields.String(
        required=True,
        validate=validate.Length(min=1, max=4000),
    )

    class Meta:
        unknown = "exclude"
