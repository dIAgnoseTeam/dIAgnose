from flask import Blueprint, jsonify
from app.utils.oauth_decorator import token_required

health_bp = Blueprint("health", __name__)


@health_bp.route("/hello", methods=["GET"])
@token_required      
def hello(current_user):
    return jsonify(message="Hola mundo!")


@health_bp.route("/health", methods=["GET"])
@token_required
def healt_check(current_user):
    return jsonify(status="OK", message="El servicio esta operativo.")
