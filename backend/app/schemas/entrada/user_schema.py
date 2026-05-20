from marshmallow import Schema, fields, validate


class UpdateUserSchema(Schema):

    nombre = fields.String(
        required=False,
        validate=validate.Length(min=1, max=255),
    )
    correo = fields.Email(
        required=False,
        validate=validate.Length(max=255),
    )

    class Meta:

        unknown = "exclude"

class UpdateUserRoleSchema(Schema):
    id_rol = fields.Int(
        required=True,
        validate=validate.Range(min=1),
    )

    class Meta:
        unknown = "exclude"
