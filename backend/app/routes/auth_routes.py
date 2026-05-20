import logging

from flask import Blueprint, jsonify, redirect, make_response

from app.config import Config
from app.services.app_settings_service import AppSettingsService
from app.services.user_service import UserService
from app.utils.oauth import get_google_oauth_client
from app.utils.oauth_decorator import create_token, token_required
from app.extensions import limiter

# Configurar logger
logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/google/login")
@limiter.limit("10 per minute")
def google_login():
    # Iniciar proceso de login con Google
    google = get_google_oauth_client()
    redirect_uri = Config.BACKEND_URL.rstrip("/") + "/auth/google/callback"

    return google.authorize_redirect(redirect_uri)


@auth_bp.route("/google/callback")
@limiter.limit("10 per minute")
def google_callback():
    # Manejar el callback de Google
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

        user_service = UserService()
        existing_user = user_service.get_user_by_email(user_data["email"])

        user = user_service.create_or_update_user(correo=user_data["email"], nombre=user_data["name"])

        user_data["id_rol"] = user.id_rol
        user_data["internal_id"] = user.id

        # Crear JWT token
        jwt_token = create_token(user_data)

        # Redirigir al frontend con el token
        response = make_response(redirect(f"{Config.FRONTEND_URL}/auth/callback"))

        response.set_cookie(
            "access_token",
            jwt_token,
            httponly=True,
            secure=False,  # En producción con HTTPS debe ser True
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response

    except Exception as e:
        print(f"Error in callback: {str(e)}")
        return redirect(f"{Config.FRONTEND_URL}/login?error=auth_failed")


@auth_bp.route("/me")
@token_required
def get_current_user(current_user):
    # Obtener información del usuario actual
    from app.utils.responses import success_response, error_response
    return success_response(
        {
            "user": {
                "id": current_user["user_id"],
                "email": current_user["email"],
                "name": current_user["name"],
                "picture": current_user.get("picture"),
                "id_rol": current_user.get("id_rol"),
            }
        }
    )


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    # Cerrar sesión
    from app.utils.responses import success_response

    response, status_code = success_response({"message": "Logged out successfully"})
    response.delete_cookie("access_token")
    return response, status_code
