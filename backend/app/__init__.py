import os
from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from werkzeug.middleware.proxy_fix import ProxyFix

from app.config import Config
from app.extensions import limiter

def create_app():
    app = Flask(__name__)
    
    # Determinar si estamos en el entorno local (desarrollo)
    is_development = "localhost" in Config.FRONTEND_URL or "127.0.0.1" in Config.FRONTEND_URL
    is_behind_proxy = os.getenv("BEHIND_PROXY", "false").lower() == "true"
    
    limiter.init_app(app)
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY
    
    # Límite global del tamaño de subida de peticiones (1 MB) para prevenir ataques DOS de agotamiento de memoria
    app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024

    # Evitar encode incorrecto
    app.config['JSON_AS_ASCII'] = False

    # No añadir slash automáticamente al final de las rutas
    app.config['APPEND_SLASH'] = False

    # Configurar ProxyFix solo si estamos detrás de un proxy real en producción
    if is_behind_proxy:
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    # Configurar orígenes permitidos según entorno
    allowed_origins = [Config.FRONTEND_URL]

    # En desarrollo local, añadir variantes de localhost
    if "localhost" in Config.FRONTEND_URL:
        allowed_origins.extend([
            "http://localhost",
            "http://localhost:80",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ])

    # Inicializamos las extensiones
    CORS(
        app,
        supports_credentials=True,
        origins=allowed_origins,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type", "Authorization"],
    )

    # Configuramos OAuth
    from app.utils.oauth import configure_oauth
    configure_oauth(app)

    # Registrar blueprints para las rutas
    from app.routes.auth_routes import auth_bp
    from app.routes.case_routes import case_bp
    from app.routes.health_routes import health_bp
    from app.routes.review_routes import review_bp
    from app.routes.user_routes import user_bp
    from app.routes.role_routes import role_bp
    from app.routes.chat_routes import chat_bp
    from app.routes.historic_routes import historic_bp
    from app.routes.settings_routes import settings_bp

    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(review_bp, url_prefix="/reviews")
    app.register_blueprint(case_bp, url_prefix="/cases")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(role_bp, url_prefix="/roles")
    app.register_blueprint(chat_bp, url_prefix="/chats")
    app.register_blueprint(historic_bp, url_prefix="/historics")
    app.register_blueprint(settings_bp, url_prefix="/settings")

    from app.utils.responses import error_response

    @app.errorhandler(400)
    def bad_request(e):
        return error_response("Bad Request", 400)

    @app.errorhandler(403)
    def forbidden(e):
        return error_response("Acceso denegado", 403)

    @app.errorhandler(404)
    def not_found(e):
        return error_response("Recurso no encontrado", 404)

    @app.errorhandler(500)
    def server_error(e):
        app.logger.error("Internal error: %s", e, exc_info=True)
        return error_response("Error interno del servidor", 500)

    # Cabeceras de seguridad HTTP
    Talisman(
        app,
        force_https=not is_development and not is_behind_proxy,  # Automático: Force=True en Prod (salvo proxy), False en Local
        strict_transport_security=True,
        content_security_policy={
            "default-src": "'self'",
            "img-src": ["'self'", "data:", "https://lh3.googleusercontent.com"],
            "script-src": "'self'",
            "style-src": ["'self'", "'unsafe-inline'"],  # Necesario para Tailwind
        },
        x_content_type_options=True,
        frame_options="DENY",
        referrer_policy="strict-origin-when-cross-origin",
    )

    return app
