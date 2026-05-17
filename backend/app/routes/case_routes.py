import logging

from flask import Blueprint, jsonify, request

from app.schemas.case_schema import case_to_dict
from app.services.case_service import CaseService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required

logger = logging.getLogger(__name__)

case_bp = Blueprint("cases", __name__)


@case_bp.route("/<int:case_id>", methods=["GET"])
@token_required
def get_case_by_id(current_user, case_id: int):
    try:
        # print(type(case_id))
        service = CaseService()
        case = service.get_case_by_id(case_id)

        if not case:
            return jsonify({"error": "Case not found"}), 404

        return jsonify(case_to_dict(case)), 200
    except Exception as e:
        logger.error(f"Error al obtener el caso por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el caso"}), 500


@case_bp.route("/count", methods=["GET"])
@token_required
def get_case_count(current_user):
    try:
        service = CaseService()
        count = service.get_case_count()

        return jsonify({"cantidad_casos": count}), 200
    except Exception as e:
        logger.error(f"Error al contar los casos: {str(e)}")
        return jsonify({"error": "Error al contar los casos"}), 500


@case_bp.route("/next", methods=["GET"])
@token_required
def get_next_case_for_user(current_user):
    try:
        service = CaseService()
        case = service.get_next_case_for_user(current_user["user_id"])

        if not case:
            return jsonify({"error": "No hay casos disponibles"}), 404

        return jsonify(case_to_dict(case)), 200
    except Exception as e:
        logger.error(f"Error al contar los casos: {str(e)}")
        return jsonify({"error": "Error al mostrar el siguiente caso"}), 500


# CRUD routes, protegidas para usuarios con rol 1 (Administrador)
# Obtener todos los casos, solo para administradores, con paginación opcional
@case_bp.route("/", methods=["GET"])
@admin_required
def get_all_cases(current_user):
    try:

        limit = request.args.get("limit", default=10, type=int)
        offset = request.args.get("offset", default=0, type=int)
        search = request.args.get("search", default=None, type=str)
        dificultad = request.args.get("dificultad", default=None, type=str)

        service = CaseService()
        cases, total = service.get_all_cases(
            limit=limit,
            offset=offset,
            search=search,
            dificultad=dificultad,
        )

        return jsonify({"data": [case_to_dict(c) for c in cases], "count": total}), 200
    except Exception as e:
        logger.error(f"Error al obtener todos los casos: {str(e)}")
        return jsonify({"error": "Error al obtener los casos"}), 500


@case_bp.route("/<int:case_id>", methods=["DELETE"])
@admin_required
def delete_case(current_user, case_id: int):
    try:
        
        service = CaseService()
        success = service.delete_case(case_id)

        if not success:
            return jsonify({"error": "Case not found"}), 404

        return jsonify({"message": "Case deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error al eliminar el caso: {str(e)}")
        return jsonify({"error": "Error al eliminar el caso"}), 500
