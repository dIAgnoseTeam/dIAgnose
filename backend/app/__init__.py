from flask import Flask
from flask_cors import CORS
from app.config import Config
from werkzeug.middleware.proxy_fix import ProxyFix
import logging


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY

    # Configurar ProxyFix para producción (confiar en headers del proxy)
    # x_for=1: confiar en un proxy para X-Forwarded-For
    # x_proto=1: confiar en un proxy para X-Forwarded-Proto (HTTP vs HTTPS)
    # x_host=1: confiar en un proxy para X-Forwarded-Host
    # x_prefix=1: confiar en un proxy para X-Forwarded-Prefix
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    # Configurar logging para debug
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    # Obtener logger y mostrar configuración inicial
    logger = logging.getLogger(__name__)
    logger.debug("=" * 80)
    logger.debug("CONFIGURACIÓN DE LA APLICACIÓN")
    logger.debug(f"FRONTEND_URL: {Config.FRONTEND_URL}")
    logger.debug(f"BACKEND_URL: {Config.BACKEND_URL}")
    logger.debug(
        f"GOOGLE_CLIENT_ID: {Config.GOOGLE_CLIENT_ID[:20]}..."
        if hasattr(Config, "GOOGLE_CLIENT_ID")
        else "No configurado"
    )
    logger.debug("=" * 80)

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
    from app.routes.dataset_routes import dataset_bp
    from app.routes.health_routes import health_bp
    from app.routes.auth_routes import auth_bp

    app.register_blueprint(dataset_bp, url_prefix="/dataset")
    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
