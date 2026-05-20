from marshmallow import Schema, fields, validate

class UpdateUserSchema(Schema):
    nombre = fields.Str(required=False, validate=validate.Length(min=1, max=255))
    correo = fields.Email(required=False)
    id_rol = fields.Int(required=False)

class UpdateUserRoleSchema(Schema):
    id_rol = fields.Int(required=True)

def user_to_dict(user):
    return {
        "id": user.id,
        "nombre": user.nombre,
        "correo": user.correo,
        "id_rol": user.id_rol,
    }
