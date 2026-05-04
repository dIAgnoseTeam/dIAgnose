import os
import sys
import logging
from alembic import command
from alembic.config import Config as AlembicConfig
from app import create_app
from seed_roles import seed_roles
from seed_cases import seed_cases
from pathlib import Path

# Configurar logging
logging.basicConfig(
    format='%(asctime)s [%(levelname)-8s] %(message)s',
    level=logging.INFO,
    datefmt='%H:%M:%S'
)

# Método para ejecutar las migraciones de Alembic automáticamente al iniciar la aplicación
def run_alembic_upgrade() -> None:
    """Aplica todas las migraciones pendientes antes de arrancar la app."""
    base_dir = Path(__file__).resolve().parent
    alembic_ini_path = base_dir / "alembic.ini"
    alembic_cfg = AlembicConfig(str(alembic_ini_path))
    command.upgrade(alembic_cfg, "head")
    logging.info("Migraciones Alembic aplicadas (head).")


def run_seeders() -> None:
    """
    Seeders opcionales por variables de entorno:
    RUN_SEED_ROLES=true
    RUN_SEED_CASES=true
    """
    run_roles = os.getenv("RUN_SEED_ROLES", "true").lower() == "true"
    run_cases = os.getenv("RUN_SEED_CASES", "false").lower() == "true"

    if run_roles:
        logging.info("Ejecutando seed_roles...")
        seed_roles()
        logging.info("seed_roles completado.")

    if run_cases:
        logging.info("Ejecutando seed_cases...")
        seed_cases()
        logging.info("seed_cases completado.")

# Funcion para inicializar la aplicacion
def initialize_app():
    try:
        logging.info("INICIALIZANDO dIAgnose...")
        
        # PASO 1: Aplicar migraciones de alembic solo y siempre que se solicita
        run_migrations = os.getenv("RUN_MIGRATIONS", "true").lower() == "true"
        if run_migrations:
            logging.info("PASO 1/2: Aplicando migraciones y Inicializando DB...")
            run_alembic_upgrade()

        # PASO 2: Ejecutar seeders
        logging.info("PASO 2/2: Ejecutando seeders configurados...")
        run_seeders()

        logging.info("INICIALIZACIÓN COMPLETADA CON ÉXITO")
    except Exception as e:
        logging.error("ERROR DURANTE LA INICIALIZACIÓN")
        logging.error("Error: %s", str(e))
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
