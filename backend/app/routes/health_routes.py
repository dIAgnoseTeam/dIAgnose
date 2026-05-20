import os
from flask import Blueprint, request
from app.utils.responses import success_response, error_response

health_bp = Blueprint("health", __name__)

def is_local_request():
    return request.remote_addr in ("127.0.0.1", "::1")

@health_bp.route("/hello", methods=["GET"])
def hello():
    if not is_local_request():
        return error_response("Not found", 404)
        
    return success_response({"message": "Hola mundo!"})


@health_bp.route("/health", methods=["GET"])
def healt_check():
    if not is_local_request():
        return error_response("Not found", 404)
        
    return success_response({"status": "OK", "message": "El servicio esta operativo."})
