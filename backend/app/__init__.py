from flask import Flask
from flask_cors import CORS
from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializamos las extensiones
    CORS(app)

    # Registrar blueprints para las rutas
    from app.routes.dataset_routes import dataset_bp
    from app.routes.health_routes import health_bp

    app.register_blueprint(dataset_bp, url_prefix="/dataset")
    app.register_blueprint(health_bp, url_prefix="/health")

    return app
