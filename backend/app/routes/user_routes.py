import logging

from flask import Blueprint, jsonify, request

from app.schemas.user_schema import user_to_dict
from app.services.user_service import UserService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

user_bp = Blueprint("users", __name__)


@user_bp.route("/", methods=["GET"])
@token_required
def get_all_users(current_user):
    try:
        service = UserService()
        users = service.get_all_users()
        return jsonify([user_to_dict(u) for u in users]), 200
    except Exception as e:
        logger.error(f"Error obteniendo todos los usuarios: {str(e)}")
        return jsonify({"error": "Error al obtener los usuarios"}), 500


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


# CRUD routes, protegidas para usuarios con rol 1 (Administrador)
@user_bp.route("/<int:user_id>", methods=["PUT"])
@token_required
def update_user(current_user, user_id: int):
    try:
        if int(current_user.get("id_rol", 0)) != 1:
            return jsonify({"error": "Acceso denegado"}), 403

        data = request.get_json()
        service = UserService()
        updated_user = service.update_user(user_id, data)

        if not updated_user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user_to_dict(updated_user)), 200
    except Exception as e:
        logger.error(f"Error actualizando el usuario: {str(e)}")
        return jsonify({"error": "Error al actualizar el usuario"}), 500


@user_bp.route("/<int:user_id>/role", methods=["PUT"])
@token_required
def change_user_role(current_user, user_id: int):
    try:
        if int(current_user.get("id_rol", 0)) != 1:
            return jsonify({"error": "Acceso denegado"}), 403

        data = request.get_json()
        new_role = data.get("id_rol")

        if new_role is None:
            return jsonify({"error": "Rol no especificado"}), 400

        service = UserService()
        updated_user = service.change_user_role(user_id, new_role)

        if not updated_user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user_to_dict(updated_user)), 200
    except Exception as e:
        logger.error(f"Error cambiando el rol del usuario: {str(e)}")
        return jsonify({"error": "Error al cambiar el rol del usuario"}), 500
