import logging
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.schemas.salida.appsettings_schema import appsettings_to_dict, appsettings_public_to_dict
from app.schemas.entrada.settings_schema import UpdateSettingsSchema, SetChatEnabledSchema
from app.services.app_settings_service import AppSettingsService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.roles import RolId
from app.utils.audit import log_admin_action
from app.utils.responses import error_response, success_response

logger = logging.getLogger(__name__)

settings_bp = Blueprint("settings", __name__)

service = AppSettingsService()

@settings_bp.route("/", methods=["GET"])
@token_required
def get_settings(current_user):
    try:
        settings = service.get_or_create()

        if int(current_user.get("id_rol", 0)) == RolId.ADMIN:
            return success_response(appsettings_to_dict(settings))
        
        return success_response(appsettings_public_to_dict(settings))
    except Exception as e:
        logger.error(f"Error obteniendo configuración: {e}")
        return error_response("Error al obtener la configuración", 500)


@settings_bp.route("/", methods=["PATCH"])
@admin_required
def update_settings(current_user):

    schema = UpdateSettingsSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response("Datos inválidos", 422, details=err.messages)

    if not data:
        return error_response("No se proporcionaron campos para actualizar", 400)

    try:
        settings = service.update_settings(data)
        
        log_admin_action(
            user_id=current_user.get("user_id"),
            action="UPDATE_SETTINGS",
            resource="app_settings",
            details=f"updated_fields={list(data.keys())}"
        )
        
        return success_response(appsettings_to_dict(settings))
    except Exception as e:
        logger.error(f"Error actualizando configuración: {e}")
        return error_response("Error al actualizar la configuración", 500)


@settings_bp.route("/chat", methods=["PATCH"])
@admin_required
def set_chat_enabled(current_user):

    schema = SetChatEnabledSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response("Datos inválidos", 422, details=err.messages)

    try:
        settings = service.update_settings({"chat_enabled": data["chat_enabled"]})
        
        log_admin_action(
            user_id=current_user.get("user_id"),
            action="TOGGLE_CHAT",
            resource="app_settings",
            details=f"chat_enabled={data['chat_enabled']}"
        )
        
        return success_response({"chat_enabled": settings.chat_enabled})
    except Exception as e:
        logger.error(f"Error actualizando chat_enabled: {e}")
        return error_response("Error al actualizar el chat", 500)


@settings_bp.route("/dashboard", methods=["GET"])
@admin_required
def get_dashboard(current_user):

    try:
        stats = service.get_dashboard_stats()
        return success_response(stats)
    except Exception as e:
        logger.error(f"Error obteniendo dashboard: {e}")
        return error_response("Error al obtener el dashboard", 500)


@settings_bp.route("/status", methods=["GET"])
@admin_required
def get_system_status(current_user):

    try:
        settings = service.get_or_create()
        return success_response(
            {
                "configuracion": appsettings_to_dict(settings),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception as e:
        logger.error(f"Error obteniendo estado del sistema: {e}")
        return error_response("Error al obtener el estado del sistema", 500)
