import requests
from requests.exceptions import RequestException
from app.config import Config
from app.repositories.chat_repository import ChatRepository
from app.repositories.historic_repository import HistoricoRepository


import json
import logging

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        self.chat_repository = ChatRepository()
        self.historic_repository = HistoricoRepository()
        self.ai_api_url = Config.AI_API_URL

    def get_chat_count(self):
        return self.chat_repository.get_chat_count()

    def get_chat_by_id(self, chat_id: int):
        return self.chat_repository.get_chat_by_id(chat_id)

    def create_chat(self, chat_data: dict):
        return self.chat_repository.create_chat(chat_data)

    def read_chats_by_user_id(self, user_id: int):
        return self.chat_repository.read_chats_by_user_id(user_id)

    def delete_chat(self, chat_id: int):
        return self.chat_repository.delete_chat(chat_id)

    def update_chat(self, chat_id: int, chat_data: dict):
        return self.chat_repository.update_chat(chat_id, chat_data)

    def process_user_message(self, chat_id: int, user_message: str):
        # Procesa un mensaje nuevo de usuario, consulta a la IA y guarda el histórico

        # 1 - Obtenener el histórico del chat
        historicos_db = self.historic_repository.read_historicos_by_chat_id(chat_id)

        # 2 - Formateral el histórico para la IA
        history_for_api = []
        if historicos_db:
            for h in historicos_db:
                mensaje_texto = h.mensaje
                if isinstance(mensaje_texto, (bytes, bytearray, memoryview)):
                    mensaje_texto = bytes(mensaje_texto).decode("utf-8")

                history_for_api.append({"role": h.rol, "content": mensaje_texto})

        # 3 - Guardar el nuevo mensaje en la DB
        nuevo_historico = {"id_chat": chat_id, "rol": "user", "mensaje": user_message}
        self.historic_repository.create_historico(nuevo_historico)

        # 4 - Preparar JSON
        payload = {"new_message": {"role": "user", "content": user_message}}

        # Añadimos historico solo si existe
        if history_for_api:
            payload["history"] = history_for_api

        # === Sustituimos los prints que exponían datos de historiales enteros por un logging limpio ===
        logger.debug("AI API request enviada al chat %s con history_count=%d", chat_id, len(history_for_api))

        # 5 - Enviar a la API Limitando el tiempo (SEC-08 timeout y limite respuesta)
        # Timeout=(conexión, lectura) -> Evita bloqueos en workers
        try:
            response = requests.post(
                self.ai_api_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=(5, 30),
                stream=False,  # Leer solo hasta el tope
            )
        except RequestException as exc:
            logger.error("Error llamando a la API de IA para el chat %s: %s", chat_id, str(exc))
            return {"error": "No se pudo contactar con la API de IA", "status_code": 503}

        if not response.ok:
            logger.error(
                "API de IA respondió con error para el chat %s: status=%s body=%s",
                chat_id,
                response.status_code,
                response.text[:1000],
            )
            return {
                "error": f"Error en la API de IA: {response.status_code}",
                "status_code": 502,
            }

        try:
            ai_data = response.json()
        except ValueError as exc:
            logger.error("Respuesta inválida de la API de IA para el chat %s: %s", chat_id, str(exc))
            return {"error": "La API de IA devolvió una respuesta inválida", "status_code": 502}

        if isinstance(ai_data, list) and ai_data and isinstance(ai_data[0], dict):
            ai_text = ai_data[0].get("generated_text")
        elif isinstance(ai_data, dict):
            ai_text = ai_data.get("generated_text")
        else:
            ai_text = None

        if not ai_text:
            logger.error("La API de IA no devolvió generated_text para el chat %s", chat_id)
            return {"error": "La API de IA no devolvió texto generado", "status_code": 502}

        # 6. Guardamos la respuesta de la IA en la DB
        respuesta_historico = {"id_chat": chat_id, "rol": "assistant", "mensaje": ai_text}
        self.historic_repository.create_historico(respuesta_historico)

        # Devolver el texto
        return {"generated_text": ai_text}
