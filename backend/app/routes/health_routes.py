from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify(message="Hola mundo!")


@health_bp.route("/health", methods=["GET"])
def healt_check():
    return jsonify(status="OK", message="El servicio esta operativo.")
