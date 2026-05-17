import datetime
import logging

from flask import Blueprint, jsonify, request

from app.schemas.historic_schema import historic_to_dict
from app.services.historic_service import HistoricService
from app.services.chat_service import ChatService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.ownership_required import check_ownership_or_admin

logger = logging.getLogger(__name__)

historic_bp = Blueprint("historics", __name__)


@historic_bp.route("/count", methods=["GET"])
@admin_required
def get_historico_count(current_user):
    try:
        service = HistoricService()
        count = service.get_historico_count()
        return jsonify({"count": count}), 200

    except Exception as e:
        logger.error(f"Error obteniendo el conteo de históricos: {str(e)}")
        return jsonify({"error": "Error al obtener el conteo de históricos"}), 500


@historic_bp.route("/<int:historico_id>", methods=["GET"])
@token_required
def get_historico_by_id(current_user, historico_id: int):
    try:
        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return jsonify({"error": "Histórico no encontrado"}), 404

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403
        
        return jsonify(historic_to_dict(historico)), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo el histórico por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el histórico"}), 500


@historic_bp.route("/", methods=["POST"])
@token_required
def create_historico(current_user):
    try:

        data = request.get_json()

        chat = ChatService().get_chat_by_id(data.get("id_chat"))
        if not chat:
            return jsonify({"error": "Chat no encontrado"}), 404

        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        service = HistoricService()
        historico = service.create_historico(data)
        return jsonify(historic_to_dict(historico)), 201
    
    except Exception as e:
        logger.error(f"Error creando el histórico: {str(e)}")
        return jsonify({"error": "Error al crear el histórico"}), 500


@historic_bp.route("/chat/<int:chat_id>", methods=["GET"])
@token_required
def get_historicos_by_chat_id(current_user, chat_id: int):
    try:
        
        chat = ChatService().get_chat_by_id(chat_id)
        if not chat:
            return jsonify({"error": "Chat no encontrado"}), 404

        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        service = HistoricService()
        historicos = service.read_historicos_by_chat_id(chat_id)

        return jsonify([historic_to_dict(h) for h in historicos] if historicos else []), 200
    
    except Exception as e:
        logger.error(f"Error obteniendo los históricos por ID de chat: {str(e)}")
        return jsonify({"error": "Error al obtener los históricos por ID de chat"}), 500


@historic_bp.route("/<int:historico_id>", methods=["DELETE"])
@token_required
def delete_historico(current_user, historico_id: int):
    try:

        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return jsonify({"error": "Histórico no encontrado"}), 404

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        success = service.delete_historico(historico_id)

        return jsonify({"message": "Histórico eliminado exitosamente"}), 200
    
    except Exception as e:
        logger.error(f"Error eliminando el histórico: {str(e)}")
        return jsonify({"error": "Error al eliminar el histórico"}), 500


@historic_bp.route("/<int:historico_id>", methods=["PUT"])
@token_required
def update_historico(current_user, historico_id: int):
    try:
        
        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return jsonify({"error": "Histórico no encontrado"}), 404

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        data = request.get_json()
        updated_historico = service.update_historico(historico_id, data)

        return jsonify(historic_to_dict(updated_historico)), 200
    
    except Exception as e:
        logger.error(f"Error actualizando el histórico: {str(e)}")
        return jsonify({"error": "Error al actualizar el histórico"}), 500
