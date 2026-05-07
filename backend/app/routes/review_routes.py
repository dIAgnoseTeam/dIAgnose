import logging

from flask import Blueprint, jsonify, request

from app.schemas.review_schema import review_to_dict
from app.services.app_settings_service import AppSettingsService
from app.services.review_service import ReviewService
from app.utils.oauth_decorator import token_required

logger = logging.getLogger(__name__)

review_bp = Blueprint("reviews", __name__)


@review_bp.route("/", methods=["GET"])
@token_required
def get_reviews(current_user):
    try:
        limit  = request.args.get("limit",  default=10,  type=int)
        offset = request.args.get("offset", default=0,   type=int)
        email  = request.args.get("email",  default=None, type=str)
        fecha  = request.args.get("fecha",  default=None, type=str)
        score  = request.args.get("score",  default=None, type=int)

        service = ReviewService()
        valoraciones, total = service.get_all_reviews(
            limit=limit,
            offset=offset,
            email=email,
            fecha=fecha,
            puntuacion=score
        )

        return jsonify({"data": [review_to_dict(v) for v in valoraciones], "count": total}), 200
    except Exception as e:
        logger.error(f"Error obteniendo valoraciones: {e}")
        return jsonify({"error": "Error al obtener las valoraciones"}), 500
    
# Rutas para las estadisticas de valoraciones
@review_bp.route("/stats", methods=["GET"])
@token_required
def get_review_stats(current_user):
    try:
        service = ReviewService()
        stats = service.get_stats()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error obteniendo stats: {e}")
        return jsonify({"error": "Error al obtener las stats"}), 500


@review_bp.route("/<int:valoracion_id>", methods=["GET"])
@token_required
def get_review(current_user, valoracion_id):
    try:
        service = ReviewService()
        valoracion = service.get_review_by_id(valoracion_id)

        if not valoracion:
            return jsonify({"error": "Valoración no encontrada"}), 404

        return jsonify(review_to_dict(valoracion)), 200
    except Exception as e:
        logger.error(f"Error obteniendo la valoración: {str(e)}")
        return jsonify({"error": "Error al obtener la valoración"}), 500


@review_bp.route("/user/<int:user_id>", methods=["GET"])
@token_required
def get_user_reviews(current_user, user_id):
    try:
        service = ReviewService()
        valoraciones = service.get_reviews_by_user_id(user_id)

        return jsonify({"data": [review_to_dict(v) for v in valoraciones], "count": len(valoraciones)}), 200
    except Exception as e:
        logger.error(f"Error obteniendo valoraciones del usuario: {str(e)}")
        return jsonify({"error": "Error al obtener las valoraciones del usuario"}), 500


@review_bp.route("/create", methods=["POST"])
@token_required
def create_review(current_user):
    try:
        # Verificar que las valoraciones estén habilitadas en la configuración
        settings_service = AppSettingsService()
        app_settings = settings_service.get_or_create()
        if not app_settings.reviews_enabled:
            return jsonify({"error": "La creación de valoraciones está desactivada temporalmente"}), 503

        data = request.get_json()

        # Validar campos requeridos
        required_fields = [
            "id_caso",
            "id_usuario",
            "puntuacion",
            "precision_diagnostica",
            "claridad_textual",
            "relevancia_clinica",
            "adecuacion_contextual",
            "nivel_tecnico",
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

        service = ReviewService()
        user_id = current_user["user_id"]
        case_id = data["id_caso"]

        # Validar que el usuario no haya revisado ya este caso
        if service.user_has_reviewed_case(user_id, case_id):
            return jsonify({"error": "Ya has revisado este caso clínico"}), 409

        # Validar que el caso no haya alcanzado el máximo de revisiones permitidas (configurable)
        max_reviews = app_settings.max_reviews_per_case
        if service.count_reviews_by_case(case_id) >= max_reviews:
            return jsonify({"error": f"Este caso ya ha sido revisado el máximo de veces permitidas ({max_reviews})"}), 409

        nueva_valoracion = service.create_review(data)
        return jsonify(review_to_dict(nueva_valoracion)), 201
    except Exception as e:
        logger.error(f"Error creando la valoración: {str(e)}")
        return jsonify({"error": "Error al crear la valoración"}), 500
