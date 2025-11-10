from flask import Flask
from flask_cors import CORS
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
df = ds.to_pandas()

# Creamos la aplicación Flask
app = Flask(__name__)
CORS(app)


# Ruta principal
@app.route("/primeraconexion", methods=["GET"])
def primeraconexion():
    return "Conexión exitosa al backend de dIAgnose!"


# Ruta principal
@app.route("/registro_test/<num>", methods=["GET"])
def registro_test(num):
    print(f"Obteniendo registro número: {num}")
    return df.iloc[int(num)].to_json()


# Ejecutamos la app
if __name__ == "__main__":
    app.run(debug=True)
