import logging

from flask import Blueprint, jsonify, request

from app.schemas.role_schema import role_to_dict
from app.services.role_service import RoleService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

role_bp = Blueprint("roles", __name__)

@role_bp.route("/<int:role_id>", methods=["GET"])
@token_required
def get_role_by_id(current_user, role_id: int):
    try:
        service = RoleService()
        role = service.get_role_by_id(role_id)

        if not role:
            return jsonify({"error": "Rol no encontrado"}), 404

        return jsonify(role_to_dict(role)), 200
    except Exception as e:
        logger.error(f"Error obteniendo el rol por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el rol"}), 500

@role_bp.route("/count", methods=["GET"])
@token_required
def get_roles_count(current_user):
    try:
        service = RoleService()
        count = service.get_roles_count()
        return jsonify({"count": count}), 200
    
    except Exception as e:
        logger.error(f"Error obteniendo el conteo de roles: {str(e)}")
        return jsonify({"error": "Error al obtener el conteo de roles"}), 500