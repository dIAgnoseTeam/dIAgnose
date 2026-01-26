def review_to_dict(valoracion):
    return {
        "id": valoracion.id,
        "id_usuario": valoracion.id_usuario,
        "puntuacion": valoracion.puntuacion,
        "mensaje": valoracion.mensaje,
        "precision_diagnostica": valoracion.precision_diagnostica,
        "claridad_textual": valoracion.claridad_textual,
        "relevancia_clinica": valoracion.relevancia_clinica,
        "adecuacion_contextual": valoracion.adecuacion_contextual,
        "nivel_tecnico": valoracion.nivel_tecnico,
    }
