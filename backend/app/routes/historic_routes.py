import datetime
import logging

from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.salida.historic_schema import historic_to_dict
from app.schemas.entrada.historic_schema import CreateHistoricSchema, UpdateHistoricSchema
from app.services.historic_service import HistoricService
from app.services.chat_service import ChatService
from app.utils.oauth_decorator import token_required
from app.utils.admin_decorator import admin_required
from app.utils.ownership_required import check_ownership_or_admin
from app.utils.responses import success_response, error_response

logger = logging.getLogger(__name__)

historic_bp = Blueprint("historics", __name__)


@historic_bp.route("/count", methods=["GET"])
@admin_required
def get_historico_count(current_user):
    try:
        service = HistoricService()
        count = service.get_historico_count()
        return success_response({"count": count})

    except Exception as e:
        logger.error(f"Error obteniendo el conteo de históricos: {str(e)}")
        return error_response("Error al obtener el conteo de históricos", 500)


@historic_bp.route("/<int:historico_id>", methods=["GET"])
@token_required
def get_historico_by_id(current_user, historico_id: int):
    try:
        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return error_response("Histórico no encontrado", 404)

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)
        
        return success_response(historic_to_dict(historico))
        
    except Exception as e:
        logger.error(f"Error obteniendo el histórico por ID: {str(e)}")
        return error_response("Error al obtener el histórico", 500)


@historic_bp.route("/", methods=["POST"])
@token_required
def create_historico(current_user):
    try:

        schema = CreateHistoricSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)

        chat = ChatService().get_chat_by_id(data.get("id_chat"))
        if not chat:
            return error_response("Chat no encontrado", 404)

        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        mensaje = data.get("mensaje", data.get("contenido"))
        rol = data.get("rol")

        validation_errors = {}
        if mensaje in (None, ""):
            validation_errors["mensaje"] = ["El campo 'mensaje' es requerido."]
        if rol in (None, ""):
            validation_errors["rol"] = ["El campo 'rol' es requerido."]

        if validation_errors:
            return error_response("Datos inválidos", 422, details=validation_errors)

        create_data = {
            "id_chat": data.get("id_chat"),
            "mensaje": mensaje,
            "rol": rol,
        }

        if "fecha" in data:
            create_data["fecha"] = data["fecha"]

        service = HistoricService()
        historico = service.create_historico(create_data)
        return success_response(historic_to_dict(historico), status_code=201)
    
    except Exception as e:
        logger.error(f"Error creando el histórico: {str(e)}")
        return error_response("Error al crear el histórico", 500)


@historic_bp.route("/chat/<int:chat_id>", methods=["GET"])
@token_required
def get_historicos_by_chat_id(current_user, chat_id: int):
    try:
        
        chat = ChatService().get_chat_by_id(chat_id)
        if not chat:
            return error_response("Chat no encontrado", 404)

        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        service = HistoricService()
        historicos = service.read_historicos_by_chat_id(chat_id)

        return success_response([historic_to_dict(h) for h in historicos] if historicos else [])
    
    except Exception as e:
        logger.error(f"Error obteniendo los históricos por ID de chat: {str(e)}")
        return error_response("Error al obtener los históricos por ID de chat", 500)


@historic_bp.route("/<int:historico_id>", methods=["DELETE"])
@token_required
def delete_historico(current_user, historico_id: int):
    try:

        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return error_response("Histórico no encontrado", 404)

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        success = service.delete_historico(historico_id)

        return success_response({"message": "Histórico eliminado exitosamente"})
    
    except Exception as e:
        logger.error(f"Error eliminando el histórico: {str(e)}")
        return error_response("Error al eliminar el histórico", 500)


@historic_bp.route("/<int:historico_id>", methods=["PUT"])
@token_required
def update_historico(current_user, historico_id: int):
    try:
        
        service = HistoricService()
        historico = service.get_historico_by_id(historico_id)

        if not historico:
            return error_response("Histórico no encontrado", 404)

        chat = ChatService().get_chat_by_id(historico.id_chat)
        if not check_ownership_or_admin(current_user, chat.id_usuario):
            return error_response("Acceso denegado", 403)

        schema = UpdateHistoricSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return error_response("Datos inválidos", 422, details=err.messages)
            
        updated_historico = service.update_historico(historico_id, data)

        return success_response(historic_to_dict(updated_historico))
    
    except Exception as e:
        logger.error(f"Error actualizando el histórico: {str(e)}")
        return error_response("Error al actualizar el histórico", 500)
