from flask import Blueprint, request, jsonify, redirect
from app.utils.oauth import get_google_oauth_client
from app.utils.oauth_decorator import create_token, token_required
from app.config import Config
import logging

# Configurar logger
logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/google/login")
def google_login():
    # Iniciar proceso de login con Google
    logger.debug("=" * 60)
    logger.debug("INICIANDO PROCESO DE LOGIN CON GOOGLE")
    logger.debug("=" * 60)

    # Log de la configuración
    logger.debug(f"BACKEND_URL desde Config: {Config.BACKEND_URL}")
    logger.debug(f"BACKEND_URL después de rstrip: {Config.BACKEND_URL.rstrip('/')}")

    google = get_google_oauth_client()
    redirect_uri = Config.BACKEND_URL.rstrip("/") + "/auth/google/callback"

    # Log de la URL completa del callback
    logger.debug(f"URL COMPLETA DEL CALLBACK: {redirect_uri}")
    logger.debug("=" * 60)

    return google.authorize_redirect(redirect_uri)


@auth_bp.route("/google/callback")
def google_callback():
    # Callback después de autenticación con Google
    logger.debug("=" * 60)
    logger.debug("CALLBACK DE GOOGLE RECIBIDO")
    logger.debug(f"URL completa de la petición: {request.url}")
    logger.debug(f"request.scheme: {request.scheme}")
    logger.debug(f"request.host: {request.host}")
    logger.debug(f"request.path: {request.path}")
    logger.debug(f"request.full_path: {request.full_path}")
    logger.debug(f"Args de la petición: {request.args}")
    logger.debug(
        f"Headers X-Forwarded-Proto: {request.headers.get('X-Forwarded-Proto')}"
    )
    logger.debug(f"Headers X-Forwarded-Host: {request.headers.get('X-Forwarded-Host')}")
    logger.debug("=" * 60)

    try:
        google = get_google_oauth_client()

        # Obtener token de Google
        token = google.authorize_access_token()

        # Obtener información del usuario
        user_info = token.get("userinfo")

        if not user_info:
            return redirect(f"{Config.FRONTEND_URL}/login?error=no_user_info")

        # Crear datos del usuario
        user_data = {
            "id": user_info["sub"],
            "email": user_info["email"],
            "name": user_info["name"],
            "picture": user_info.get("picture"),
            "email_verified": user_info.get("email_verified", False),
        }

        # TODO: Guardar en este punto en la base de datos si es necesario

        # Crear JWT token
        jwt_token = create_token(user_data)

        # Redirigir al frontend con el token
        return redirect(f"{Config.FRONTEND_URL}/auth/callback?token={jwt_token}")

    except Exception as e:
        print(f"Error in callback: {str(e)}")
        return redirect(f"{Config.FRONTEND_URL}/login?error=auth_failed")


@auth_bp.route("/me")
@token_required
def get_current_user(current_user):
    # Obtener información del usuario actual
    return jsonify(
        {
            "user": {
                "id": current_user["user_id"],
                "email": current_user["email"],
                "name": current_user["name"],
                "picture": current_user.get("picture"),
            }
        }
    )


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    # Cerrar sesión
    return jsonify({"message": "Logged out successfully"})
