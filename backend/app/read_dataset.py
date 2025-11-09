from huggingface_hub import login
from datasets import load_dataset
from dotenv import load_dotenv
import os

# Cargamos las variables del env
load_dotenv()

if os.getenv("HF_TOKEN"):
    login(token=os.getenv("HF_TOKEN"))

# Splits de los datasets
ds = load_dataset("ilopezmon/casos_clinicos_completos")
df = ds["BVCM017101.txt_6"].to_pandas()


print(df.head())

# Cantidad de registros en el dataset
print("Número de filas en el dataset:", len(df))
