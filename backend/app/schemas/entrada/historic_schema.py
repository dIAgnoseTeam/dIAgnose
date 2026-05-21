from marshmallow import Schema, fields, validate


class CreateHistoricSchema(Schema):
    id_chat = fields.Int(required=True)
    mensaje = fields.String(
        required=True,
        validate=validate.Length(min=1, max=20000),
    )
    rol = fields.String(
        required=True,
        validate=validate.OneOf(["user", "assistant"]),
    )

    class Meta:
        unknown = "exclude"


class UpdateHistoricSchema(Schema):
    mensaje = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=20000),
    )

    class Meta:
        unknown = "exclude"
