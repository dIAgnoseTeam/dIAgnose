from datasets import load_dataset
from app.config import Config
import pandas as pd


class DatasetRepository:
    def __init__(self):
        # Hacemos login a Hugging Face si hay token
        if Config.HF_TOKEN:
            from huggingface_hub import login

            login(token=Config.HF_TOKEN)
        # Cargamos el dataset desde Hugging Face
        self.dataset = load_dataset("ilopezmon/casos_clinicos_completos")

        # Convertimos los splits a un solo DataFrame de pandas
        df_list = []
        for split in self.dataset.keys():
            temp_df = self.dataset[split].to_pandas()
            temp_df["split"] = split  # Columna para identificar el split
            df_list.append(temp_df)

        self.df = pd.concat(df_list, ignore_index=True)

    def get_registro(self, num: int) -> dict:
        if num < 0 or num >= len(self.df):
            raise IndexError("Número de registro fuera de rango.")
        return self.df.iloc[num].to_dict()

    def get_max_register(self) -> dict:
        return len(self.df)
