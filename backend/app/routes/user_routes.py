import logging

from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.salida.user_schema import user_to_dict
from app.schemas.entrada.user_schema import UpdateUserSchema, UpdateUserRoleSchema
from app.services.user_service import UserService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.audit import log_admin_action
from app.utils.responses import success_response, error_response

logger = logging.getLogger(__name__)

user_bp = Blueprint("users", __name__)


@user_bp.route("/", methods=["GET"])
@admin_required
def get_all_users(current_user):
    try:
        limit = request.args.get("limit", default=10, type=int)
        offset = request.args.get("offset", default=0, type=int)
        
        service = UserService()
        users, total = service.get_all_users(limit=limit, offset=offset)
        return success_response([user_to_dict(u) for u in users], count=total)
    except Exception as e:
        logger.error(f"Error obteniendo todos los usuarios: {str(e)}")
        return error_response("Error al obtener los usuarios", 500)


@user_bp.route("/<int:user_id>", methods=["GET"])
@admin_required
def get_user_by_id(current_user, user_id: int):
    try:
        service = UserService()
        user = service.get_user_by_id(user_id)

        if not user:
            return error_response("Usuario no encontrado", 404)

        return success_response(user_to_dict(user))
    except Exception as e:
        logger.error(f"Error obteniendo el usuario por ID: {str(e)}")
        return error_response("Error al obtener el usuario", 500)


@user_bp.route("/count", methods=["GET"])
@admin_required
def get_user_count(current_user):
    try:
        service = UserService()
        count = service.get_users_count()

        return success_response({"cantidad_usuarios": count})
    except Exception as e:
        logger.error(f"Error al contar los usuarios: {str(e)}")
        return error_response("Error al contar los usuarios", 500)


# CRUD routes, protegidas para usuarios con rol 1 (Administrador)
@user_bp.route("/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(current_user, user_id: int):
    try:
        schema = UpdateUserSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)

        service = UserService()
        updated_user = service.update_user(user_id, data)

        if not updated_user:
            return error_response("Usuario no encontrado", 404)

        log_admin_action(
            user_id=current_user.get("user_id"),
            action="UPDATE_USER",
            resource="user",
            resource_id=user_id,
            details=f"updated_fields={list(data.keys())}"
        )

        return success_response(user_to_dict(updated_user))
    except Exception as e:
        logger.error(f"Error actualizando el usuario: {str(e)}")
        return error_response("Error al actualizar el usuario", 500)


@user_bp.route("/<int:user_id>/role", methods=["PUT"])
@admin_required
def change_user_role(current_user, user_id: int):
    try:
        schema = UpdateUserRoleSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)
            
        new_role = data.get("id_rol")

        service = UserService()
        updated_user = service.change_user_role(user_id, new_role)

        if not updated_user:
            return error_response("Usuario no encontrado", 404)

        log_admin_action(
            user_id=current_user.get("user_id"),
            action="CHANGE_ROLE",
            resource="user",
            resource_id=user_id,
            details=f"new_role={new_role}"
        )

        return success_response(user_to_dict(updated_user))
    except Exception as e:
        logger.error(f"Error cambiando el rol del usuario: {str(e)}")
        return error_response("Error al cambiar el rol del usuario", 500)
