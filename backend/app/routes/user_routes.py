import logging

from flask import Blueprint, jsonify, request

from app.schemas.user_schema import user_to_dict
from app.services.user_service import UserService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

user_bp = Blueprint("users", __name__)

@user_bp.route("/<int:user_id>", methods=["GET"])
@token_required
def get_user_by_id(current_user, user_id: int):
    try:
        service = UserService()
        user = service.get_user_by_id(user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user_to_dict(user)), 200
    except Exception as e:
        logger.error(f"Error obteniendo el usuario por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el usuario"}), 500

@user_bp.route("/count", methods=["GET"])
@token_required
def get_user_count(current_user):
    try:
        service = UserService()
        count = service.get_users_count()

        return jsonify({"cantidad_usuarios": count}), 200
    except Exception as e:
        logger.error(f"Error al contar los usuarios: {str(e)}")
        return jsonify({"error": "Error al contar los usuarios"}), 500