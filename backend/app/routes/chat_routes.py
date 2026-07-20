from datetime import datetime
import logging

from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.salida.chat_schema import chat_to_dict
from app.schemas.entrada.chat_schema import CreateChatSchema, UpdateChatSchema, SendChatMessageSchema
from app.services.chat_service import ChatService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.ownership_required import check_ownership_or_admin
from app.extensions import limiter
from app.utils.responses import success_response, error_response

logger = logging.getLogger(__name__)

chat_bp = Blueprint("chats", __name__)


@chat_bp.route("/count", methods=["GET"])
@admin_required
def get_chat_count(current_user):
    try:
        service = ChatService()
        count = service.get_chat_count()

        return success_response({"cantidad_chats": count})
    except Exception as e:
        logger.error(f"Error al contar los chats: {str(e)}")
        return error_response("Error al contar los chats", 500)


@chat_bp.route("/<int:chat_id>", methods=["GET"])
@token_required
def get_chat_by_id(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return error_response("Chat not found", 404)
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        return success_response(chat_to_dict(chat))
    except Exception as e:
        logger.error(f"Error al obtener el chat por ID: {str(e)}")
        return error_response("Error al obtener el chat", 500)


@chat_bp.route("/user/<int:user_id>", methods=["GET"])
@token_required
def get_chats_by_user_id(current_user, user_id: int):
    try:

        if not check_ownership_or_admin(current_user, user_id):
            return error_response("Acceso denegado", 403)
        
        service = ChatService()
        chats = service.read_chats_by_user_id(user_id)

        return success_response([chat_to_dict(c) for c in chats])
    except Exception as e:
        logger.error(f"Error al obtener los chats por ID de usuario: {str(e)}")
        return error_response("Error al obtener los chats", 500)


@chat_bp.route("/", methods=["POST"])
@token_required
def create_chat(current_user):
    try:
        schema = CreateChatSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)
            
        service = ChatService()
        chat = service.create_chat(data)

        return success_response(chat_to_dict(chat), status_code=201)
    except Exception as e:
        logger.error(f"Error al crear el chat: {str(e)}")
        return error_response("Error al crear el chat", 500)


@chat_bp.route("/<int:chat_id>", methods=["DELETE"])
@token_required
def delete_chat(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return error_response("Chat not found", 404)
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        success = service.delete_chat(chat_id)

        return success_response({"message": "Chat deleted successfully"})
    except Exception as e:
        logger.error(f"Error al eliminar el chat: {str(e)}")
        return error_response("Error al eliminar el chat", 500)


@chat_bp.route("/<int:chat_id>", methods=["PUT"])
@token_required
def update_chat(current_user, chat_id: int):
    try:
        service = ChatService()
        chat = service.get_chat_by_id(chat_id)

        if not chat:
            return error_response("Chat not found", 404)
        
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        schema = UpdateChatSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)
            
        chat = service.update_chat(chat_id, data)

        return success_response(chat_to_dict(chat))
    except Exception as e:
        logger.error(f"Error al actualizar el chat: {str(e)}")
        return error_response("Error al actualizar el chat", 500)


@chat_bp.route("/<int:chat_id>/message", methods=["POST"])
@token_required
@limiter.limit("70 per hour")
def send_message_to_chat(current_user, chat_id: int):
    try:
        schema = SendChatMessageSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)
            
        user_message_text = data.get("message")
        
        service = ChatService()

        # Verificar que el chat existe
        chat = service.get_chat_by_id(chat_id)
        if not chat:
            return error_response("Chat not found", 404)

        if chat and chat.id_usuario != current_user.get("user_id"):
            return error_response("No tienes permiso para enviar mensajes a este chat", 403)

        # Llamamos al orquestador
        response = service.process_user_message(chat_id, user_message_text)

        if isinstance(response, dict) and response.get("error"):
            return error_response(response["error"], response.get("status_code", 502))

        # Devolvemos la respuesta de la IA al frontend
        return success_response(response)
    except Exception as e:
        logger.error(f"Error al procesar el mensaje del chat: {str(e)}")
        return error_response("Error al procesar el mensaje del chat", 500)
