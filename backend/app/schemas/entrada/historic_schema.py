from marshmallow import Schema, fields, validate


class CreateHistoricSchema(Schema):
    id_chat = fields.Int(required=True)
    contenido = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=20000),
    )
    rol = fields.String(required=False, validate=validate.Length(max=50))

    class Meta:
        unknown = "exclude"


class UpdateHistoricSchema(Schema):
    contenido = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=20000),
    )

    class Meta:
        unknown = "exclude"
