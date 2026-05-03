import os
import sys
import logging
from app import create_app
from db import init_database
from seed_roles import seed_roles
from seed_cases import seed_cases

# Configurar logging
logging.basicConfig(
    format='%(asctime)s [%(levelname)-8s] %(message)s',
    level=logging.INFO,
    datefmt='%H:%M:%S'
)

# Funcion para inicializar la aplicacion
def initialize_app():
    try:
        logging.info("INICIALIZANDO dIAgnose...")
        
        # PASO 1: Inicializar base de datos
        logging.info("PASO 1/3: Inicializando base de datos...")
        init_database()
        logging.info("Base de datos inicializada correctamente\n")
        
        # PASO 2: Sembrar roles
        logging.info("PASO 2/3: Cargando roles del sistema...")
        seed_roles()
        logging.info("Roles cargados correctamente\n")
        
        # PASO 3: Sembrar casos clínicos
        logging.info("PASO 3/3: Cargando casos clínicos desde Hugging Face...")
        seed_cases()
        logging.info("Casos clínicos cargados correctamente\n")
        
        logging.info("INICIALIZACIÓN COMPLETADA CON ÉXITO")
        
    except Exception as e:
        logging.error("ERROR DURANTE LA INICIALIZACIÓN")
        logging.error(f"Error: {str(e)}")
        logging.error("La aplicación no puede iniciarse. Revisa los logs anteriores.")
        sys.exit(1)

# Crear la aplicación Flask
app = create_app()

if __name__ == "__main__":
    # Evitar ejecutar seeders dos veces con el reloader de Flask
    is_reloader = os.environ.get('WERKZEUG_RUN_MAIN') == 'true'
    
    if not is_reloader:
        # Solo ejecutar seeders en el proceso principal, si no se ejecuta dos veces
        initialize_app()
    
    # Iniciar servidor Flask    
    app.run(debug=True, host="0.0.0.0", port=5000)
