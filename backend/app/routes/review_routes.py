from flask import Blueprint, request, jsonify
from app.services.review_service import ReviewService
from app.schemas.review_schema import review_to_dict
from app.utils.oauth_decorator import token_required
import logging

logger = logging.getLogger(__name__)

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/', methods=['GET'])
@token_required
def get_reviews(current_user):
    try:
        limit = request.args.get('limit', default=10, type=int)
        offset = request.args.get('offset', default=0, type=int)
        
        service = ReviewService()
        valoraciones = service.get_all_reviews(limit, offset)
        
        return jsonify({
            "data": [review_to_dict(v) for v in valoraciones],
            "count": len(valoraciones)
        }), 200
    except Exception as e:
        logger.error(f"Error obteniendo valoraciones: {e}")
        return jsonify({"error": "Error al obtener las valoraciones"}), 500
    
@review_bp.route('/<int:valoracion_id>', methods=['GET'])
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

@review_bp.route('/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_reviews(current_user, user_id):
    try:
        service = ReviewService()
        valoraciones = service.get_reviews_by_user_id(user_id)
        
        return jsonify({
            "data": [review_to_dict(v) for v in valoraciones],
            "count": len(valoraciones)
        }), 200
    except Exception as e:
        logger.error(f"Error obteniendo valoraciones del usuario: {str(e)}")
        return jsonify({"error": "Error al obtener las valoraciones del usuario"}), 500

@review_bp.route('/create', methods=['POST'])
@token_required
def create_review(current_user):
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ["id_usuario", "puntuacion", "precision_diagnostica", 
                          "claridad_textual", "relevancia_clinica", 
                          "adecuacion_contextual", "nivel_tecnico"]
    
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo requerido: {field}"}), 400
        service = ReviewService()
        nueva_valoracion = service.create_review(data)
        return jsonify(review_to_dict(nueva_valoracion)), 201
    except Exception as e:
        logger.error(f"Error creando la valoración: {str(e)}")
        return jsonify({"error": "Error al crear la valoración"}), 500
