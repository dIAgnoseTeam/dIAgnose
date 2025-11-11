from flask import Blueprint, jsonify
from app.services.dataset_service import DatasetService
from app.utils.response import success_response, error_response

dataset_bp = Blueprint("dataset", __name__)
dataset_service = DatasetService()


# Rutas
# Ruta para obtener un registro por su número
@dataset_bp.route("/registro/<int:num>", methods=["GET"])
def get_registro(num: int):
    try:
        registro = dataset_service.get_registro(num)
        return success_response(registro, "Registro obtenido con éxito")
    except IndexError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(f"Error interno del servidor: {str(e)}", 500)
