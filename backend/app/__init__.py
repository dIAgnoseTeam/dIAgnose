import logging

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY

    # Configurar ProxyFix para producción (confiar en headers del proxy)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    # Configurar orígenes permitidos según entorno
    allowed_origins = [Config.FRONTEND_URL]

    # En desarrollo local, normalmente en Docker
    if "localhost" in Config.FRONTEND_URL:
        allowed_origins.extend(["http://localhost", "http://localhost:80"])

    # Inicializamos las extensiones
    # Docker configurations
    CORS(
        app,
        supports_credentials=True,
        origins=[Config.FRONTEND_URL],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type", "Authorization"],
    )

    # Prod configurations
    # CORS(app, supports_credentials=True,
    # origins=[Config.FRONTEND_URL],
    # allow_headers=["Content-Type", "Authorization"],
    # expose_headers=["Content-Type", "Authorization"])

    # Configuramos OAuth
    from app.utils.oauth import configure_oauth

    oauth = configure_oauth(app)

    # Registrar blueprints para las rutas
    from app.routes.auth_routes import auth_bp
    from app.routes.dataset_routes import dataset_bp
    from app.routes.health_routes import health_bp

    app.register_blueprint(dataset_bp, url_prefix="/dataset")
    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
