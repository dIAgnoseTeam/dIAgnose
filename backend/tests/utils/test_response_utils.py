from app.utils.response import error_response, success_response


class TestSuccessResponse:
    """Tests para success_response"""

    def test_success_response_default_status(self, app):
        with app.app_context():
            response, status_code = success_response({"key": "val"})
            data = response.get_json()

            assert status_code == 200
            assert data["success"] is True
            assert data["message"] == "Success"
            assert data["data"] == {"key": "val"}

    def test_success_response_custom_message(self, app):
        with app.app_context():
            response, status_code = success_response("ok", "Registro creado")
            data = response.get_json()

            assert data["message"] == "Registro creado"
            assert data["data"] == "ok"

    def test_success_response_custom_status_code(self, app):
        with app.app_context():
            response, status_code = success_response("created", "OK", 201)

            assert status_code == 201


class TestErrorResponse:
    """Tests para error_response"""

    def test_error_response_default_status(self, app):
        with app.app_context():
            response, status_code = error_response("Algo falló", "Error")
            data = response.get_json()

            assert status_code == 400
            assert data["success"] is False

    def test_error_response_custom_status_code(self, app):
        with app.app_context():
            response, status_code = error_response(
                "No encontrado", "Not found", 404
            )

            assert status_code == 404
