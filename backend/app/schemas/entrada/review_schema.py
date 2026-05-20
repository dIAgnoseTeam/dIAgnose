from marshmallow import Schema, fields, validate


class CreateReviewSchema(Schema):
    id_caso = fields.Int(required=True)
    id_usuario = fields.Int(required=True)
    puntuacion = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    precision_diagnostica = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    claridad_textual = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    relevancia_clinica = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    adecuacion_contextual = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    nivel_tecnico = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5),
    )
    mensaje = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=5000),
    )

    class Meta:
        unknown = "exclude"
