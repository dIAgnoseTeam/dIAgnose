from datetime import datetime
import logging

from flask import Blueprint, jsonify, request

from app.schemas.chat_schema import chat_to_dict
from app.services.chat_service import ChatService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.ownership_required import check_ownership_or_admin

logger = logging.getLogger(__name__)

chat_bp = Blueprint("chats", __name__)


@chat_bp.route("/count", methods=["GET"])
@admin_required
def get_chat_count(current_user):
    try:
        service = ChatService()
        count = service.get_chat_count()

        return jsonify({"cantidad_chats": count}), 200
    except Exception as e:
        logger.error(f"Error al contar los chats: {str(e)}")
        return jsonify({"error": "Error al contar los chats"}), 500


@chat_bp.route("/<int:chat_id>", methods=["GET"])
@token_required
def get_chat_by_id(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        return jsonify(chat_to_dict(chat)), 200
    except Exception as e:
        logger.error(f"Error al obtener el chat por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el chat"}), 500


@chat_bp.route("/user/<int:user_id>", methods=["GET"])
@token_required
def get_chats_by_user_id(current_user, user_id: int):
    try:

        if not check_ownership_or_admin(current_user, user_id):
            return jsonify({"error": "Acceso denegado"}), 403
        
        service = ChatService()
        chats = service.read_chats_by_user_id(user_id)

        return jsonify([chat_to_dict(c) for c in chats]), 200
    except Exception as e:
        logger.error(f"Error al obtener los chats por ID de usuario: {str(e)}")
        return jsonify({"error": "Error al obtener los chats"}), 500


@chat_bp.route("/", methods=["POST"])
@token_required
def create_chat(current_user):
    try:
        data = request.get_json()
        service = ChatService()
        chat = service.create_chat(data)

        return jsonify(chat_to_dict(chat)), 201
    except Exception as e:
        logger.error(f"Error al crear el chat: {str(e)}")
        return jsonify({"error": "Error al crear el chat"}), 500


@chat_bp.route("/<int:chat_id>", methods=["DELETE"])
@token_required
def delete_chat(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        success = service.delete_chat(chat_id)

        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error al eliminar el chat: {str(e)}")
        return jsonify({"error": "Error al eliminar el chat"}), 500


@chat_bp.route("/<int:chat_id>", methods=["PUT"])
@token_required
def update_chat(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return jsonify({"error": "Acceso denegado"}), 403

        data = request.get_json()
        chat = service.update_chat(chat_id, data)

        return jsonify(chat_to_dict(chat)), 200
    except Exception as e:
        logger.error(f"Error al actualizar el chat: {str(e)}")
        return jsonify({"error": "Error al actualizar el chat"}), 500


@chat_bp.route("/<int:chat_id>/message", methods=["POST"])
@token_required
def send_message_to_chat(current_user, chat_id: int):
    try:
        data = request.get_json()
        user_message_text = data.get("message")
        # Validación básica
        if not user_message_text:
            return jsonify({"error": "El campo 'message' es obligatorio"}), 400
        service = ChatService()

        # Verificar que el chat existe
        chat = service.get_chat_by_id(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        if chat and chat.id_usuario != current_user.get("user_id"):
            return jsonify({"error": "No tienes permiso para enviar mensajes a este chat"}), 403

        # Llamamos al orquestador
        response = service.process_user_message(chat_id, user_message_text)

        # Devolvemos la respuesta de la IA al frontend
        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Error al procesar el mensaje del chat: {str(e)}")
        return jsonify({"error": "Error al procesar el mensaje del chat"}), 500
