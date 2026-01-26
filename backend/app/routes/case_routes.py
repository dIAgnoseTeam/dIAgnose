from flask import Blueprint, request, jsonify
from app.services.case_service import CaseService   
from app.schemas.case_schema import case_to_dict
from app.utils.oauth_decorator import token_required
import logging

logger = logging.getLogger(__name__)

case_bp = Blueprint('cases', __name__)

@case_bp.route('/<int:case_id>', methods=['GET'])
@token_required
def get_case_by_id(current_user, case_id: int):
    try:
        #print(type(case_id))
        service = CaseService()
        case = service.get_case_by_id(case_id)
        
        if not case:
            return jsonify({"error": "Case not found"}), 404
        
        return jsonify(case_to_dict(case)), 200
    except Exception as e:
        logger.error(f"Error al obtener el caso por ID: {str(e)}")
        return jsonify({"error": "Error al obtener el caso"}), 500

@case_bp.route('/count', methods=['POST'])
@token_required
def get_case_count(current_user):
    try:
        filters = request.json.get('filters', {})
        
        service = CaseService()
        count = service.get_case_count(filters)
        
        return jsonify({"cantidad_casos": count}), 200
    except Exception as e:
        logger.error(f"Error al contar los casos: {str(e)}")
        return jsonify({"error": "Error al contar los casos"}), 500