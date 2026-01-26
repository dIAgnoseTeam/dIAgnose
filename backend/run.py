from app import create_app
from db import init_database
# Sembrar roles iniciales
from seed_roles import seed_roles

# Inicializar base de datos si no existe
init_database()
seed_roles()

# Crear aplicación Flask
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
