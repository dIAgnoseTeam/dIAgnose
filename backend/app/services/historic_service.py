from app.repositories.historic_repository import HistoricoRepository    

class HistoricService:
    def __init__(self):
        self.historico_repository = HistoricoRepository()
    
    def get_historico_count(self):
        return self.historico_repository.get_historico_count()
    
    def get_historico_by_id(self, historico_id: int):
        return self.historico_repository.get_historico_by_id(historico_id)
    
    def create_historico(self, historico_data: dict):
        return self.historico_repository.create_historico(historico_data)
    
    def read_historicos_by_chat_id(self, chat_id: int):
        return self.historico_repository.read_historicos_by_chat_id(chat_id)
    
    def delete_historico(self, historico_id: int):
        return self.historico_repository.delete_historico(historico_id)

    def update_historico(self, historico_id: int, update_data: dict):
        return self.historico_repository.update_historico(historico_id, update_data)