import logging

from flask import Blueprint, jsonify, request

from app.schemas.historic_schema import historic_to_dict
from app.services.historic_service import HistoricService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

historic_bp = Blueprint("historics", __name__)

@historic_bp.route("/count", methods=["GET"])
@token_required
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

        return jsonify(historic_to_dict(historico)), 200
    except Exception as e:
        logger.error(f"Error obteniendo el histórico por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el histórico"}), 500

@historic_bp.route("/", methods=["POST"])
@token_required
def create_historico(current_user):
    try:
        data = request.get_json()
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
        service = HistoricService()
        historicos = service.read_historicos_by_chat_id(chat_id)

        if not historicos:
            return jsonify({"error": "No se encontraron históricos para este chat"}), 404

        return jsonify([historic_to_dict(h) for h in historicos]), 200
    except Exception as e:
        logger.error(f"Error obteniendo los históricos por ID de chat: {str(e)}")
        return jsonify({"error": "Error al obtener los históricos por ID de chat"}), 500
    
@historic_bp.route("/<int:historico_id>", methods=["DELETE"])
@token_required
def delete_historico(current_user, historico_id: int):
    try:
        service = HistoricService()
        success = service.delete_historico(historico_id)

        if not success:
            return jsonify({"error": "Histórico no encontrado"}), 404

        return jsonify({"message": "Histórico eliminado exitosamente"}), 200
    except Exception as e:
        logger.error(f"Error eliminando el histórico: {str(e)}")
        return jsonify({"error": "Error al eliminar el histórico"}), 500

@historic_bp.route("/<int:historico_id>", methods=["PUT"])
@token_required
def update_historico(current_user, historico_id: int):
    try:
        data = request.get_json()
        service = HistoricService()
        updated_historico = service.update_historico(historico_id, data)

        if not updated_historico:
            return jsonify({"error": "Histórico no encontrado"}), 404

        return jsonify(historic_to_dict(updated_historico)), 200
    except Exception as e:
        logger.error(f"Error actualizando el histórico: {str(e)}")
        return jsonify({"error": "Error al actualizar el histórico"}), 500