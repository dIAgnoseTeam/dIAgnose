import logging
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from app.schemas.appsettings_schema import appsettings_to_dict, appsettings_public_to_dict
from app.services.app_settings_service import AppSettingsService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

settings_bp = Blueprint("settings", __name__)

service = AppSettingsService()

def _is_admin(current_user: dict) -> bool:
    return int(current_user.get("id_rol", 0)) == 1

@settings_bp.route("/", methods=["GET"])
@token_required
def get_settings(current_user):
    try:
        settings = service.get_or_create()
        if _is_admin(current_user):
            return jsonify(appsettings_to_dict(settings)), 200
        return jsonify(appsettings_public_to_dict(settings)), 200
    except Exception as e:
        logger.error(f"Error obteniendo configuración: {e}")
        return jsonify({"error": "Error al obtener la configuración"}), 500

@settings_bp.route("/", methods=["PATCH"])
@token_required
def update_settings(current_user):
    if not _is_admin(current_user):
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json() or {}
    if not data:
        return jsonify({"error": "No se proporcionaron campos para actualizar"}), 400

    try:
        settings = service.update_settings(data)
        return jsonify(appsettings_to_dict(settings)), 200
    except Exception as e:
        logger.error(f"Error actualizando configuración: {e}")
        return jsonify({"error": "Error al actualizar la configuración"}), 500


@settings_bp.route("/chat", methods=["PATCH"])
@token_required
def set_chat_enabled(current_user):
    if not _is_admin(current_user):
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json() or {}
    if "chat_enabled" not in data:
        return jsonify({"error": "Falta chat_enabled"}), 400

    try:
        settings = service.update_settings({"chat_enabled": bool(data["chat_enabled"])})
        return jsonify({"chat_enabled": settings.chat_enabled}), 200
    except Exception as e:
        logger.error(f"Error actualizando chat_enabled: {e}")
        return jsonify({"error": "Error al actualizar el chat"}), 500

@settings_bp.route("/dashboard", methods=["GET"])
@token_required
def get_dashboard(current_user):
    if not _is_admin(current_user):
        return jsonify({"error": "No autorizado"}), 403

    try:
        stats = service.get_dashboard_stats()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error obteniendo dashboard: {e}")
        return jsonify({"error": "Error al obtener el dashboard"}), 500


@settings_bp.route("/status", methods=["GET"])
@token_required
def get_system_status(current_user):
    if not _is_admin(current_user):
        return jsonify({"error": "No autorizado"}), 403

    try:
        settings = service.get_or_create()
        return jsonify({
            "estado": "mantenimiento" if settings.maintenance_mode else "operativo",
            "maintenance_mode": settings.maintenance_mode,
            "configuracion": appsettings_to_dict(settings),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }), 200
    except Exception as e:
        logger.error(f"Error obteniendo estado del sistema: {e}")
        return jsonify({"error": "Error al obtener el estado del sistema"}), 500

