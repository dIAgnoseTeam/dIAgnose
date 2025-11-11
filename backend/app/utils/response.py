from flask import jsonify

# Funciones para estandarizar respuestas API


# Cuando sea correcta la respuesta
def success_response(data, message="Success", status_code=200):
    return (jsonify({"success": True, "message": message, "data": data}), status_code)


def error_response(data, message="Success", status_code=400):
    return jsonify({"success": False, "message": message, "data": data}), status_code
