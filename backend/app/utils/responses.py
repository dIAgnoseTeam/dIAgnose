from flask import jsonify

def error_response(message: str, status_code: int, details=None):
    body = {"error": message, "status": status_code}
    if details:
        body["details"] = details
    return jsonify(body), status_code

def success_response(data, status_code: int = 200, count=None):
    return jsonify(data), status_code