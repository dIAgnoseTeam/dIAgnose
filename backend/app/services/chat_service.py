import requests
from app.config import Config
from app.repositories.chat_repository import ChatRepository
from app.repositories.historic_repository import HistoricoRepository


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

        # 4 - Preparar JSON
        payload = {"new_message": {"role": "user", "content": user_message}}

        # Añadimos historico solo si existe
        if history_for_api:
            payload["history"] = history_for_api

        # 5 - Enviar a la API
        response = requests.post(self.ai_api_url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)

        if response.status_code == 200:
            ai_data = response.json()

            # Preparamos la lista
            ai_text = ai_data[0]["generated_text"]

            # 6. Guardamos la respuesta de la IA en la DB
            respuesta_historico = {"id_chat": chat_id, "rol": "assistant", "mensaje": ai_text}
            self.historic_repository.create_historico(respuesta_historico)

            # Devolver el texto
            return {"generated_text": ai_text}
        else:
            # Manejo de errores
            return {"error": f"Error en la API de IA: {response.status_code} - {response.text}"}
