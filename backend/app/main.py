from flask import Flask
from flask_cors import CORS

# Creamos la aplicación Flask
app = Flask(__name__)
CORS(app)


# Ruta principal
@app.route('/primeraconexion', methods=['GET'])
def primeraconexion():
    return "¡Hola desde el backend!"


# Ejecutamos la app
if __name__ == '__main__':
    app.run(debug=True)
