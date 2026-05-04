import logging

from flask import Blueprint, jsonify, request

from app.schemas.appsettings_schema import appsettings_to_dict
from app.services.app_settings_service import AppSettingsService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

settings_bp = Blueprint("settings", __name__)

service = AppSettingsService()


@settings_bp.route("/", methods=["GET"])
@token_required
def get_settings(current_user):
    settings = service.get_or_create()
    return jsonify({"chat_enabled": settings.chat_enabled}), 200


@settings_bp.route("/chat", methods=["PATCH"])
@token_required
def set_chat_enabled(current_user):
    if current_user.get("id_rol") != 1:
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json() or {}
    if "chat_enabled" not in data:
        return jsonify({"error": "Falta chat_enabled"}), 400

    settings = service.update_settings({"chat_enabled": bool(data["chat_enabled"])})
    return jsonify({"chat_enabled": settings.chat_enabled}), 200
