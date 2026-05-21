from marshmallow import Schema, fields, validate

class CreateReviewSchema(Schema):
    id_caso = fields.Int(required=True)
    puntuacion = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    precision_diagnostica = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    claridad_textual = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    relevancia_clinica = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    adecuacion_contextual = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    nivel_tecnico = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    mensaje = fields.Str(required=False)

def review_to_dict(valoracion):
    return {
        "id": valoracion.id,
        "id_usuario": valoracion.id_usuario,
        "id_caso": valoracion.id_caso,
        "puntuacion": valoracion.puntuacion,
        "mensaje": valoracion.mensaje,
        "precision_diagnostica": valoracion.precision_diagnostica,
        "claridad_textual": valoracion.claridad_textual,
        "relevancia_clinica": valoracion.relevancia_clinica,
        "adecuacion_contextual": valoracion.adecuacion_contextual,
        "nivel_tecnico": valoracion.nivel_tecnico,
        "fecha": valoracion.fecha.isoformat()
    }
