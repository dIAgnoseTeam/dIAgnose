from unittest.mock import MagicMock, patch

from app.utils.oauth_decorator import create_token


def _make_token():
    """Helper: genera un token válido para tests."""
    return create_token({
        "id": "123",
        "email": "test@test.com",
        "name": "Test User",
    })


def _auth_header():
    return {"Authorization": f"Bearer {_make_token()}"}


class TestGetCaseById:
    """Tests para GET /cases/<id>"""

    @patch("app.routes.case_routes.CaseService")
    def test_returns_200_when_found(self, MockService, client):
        fake_case = MagicMock()
        fake_case.id = 1
        fake_case.alergias = None
        fake_case.antecedentes_familiares = None
        fake_case.antecedentes_medicos = None
        fake_case.antecedentes_quirurgicos = None
        fake_case.categoria = "Cardiología"
        fake_case.diagnostico_final = "Angina"
        fake_case.dificultad = "Alta"
        fake_case.edad = 55
        fake_case.exploracion_general = None
        fake_case.factores_sociales = None
        fake_case.habitos = None
        fake_case.medicacion_actual = None
        fake_case.motivo = "Dolor torácico"
        fake_case.razonamiento_clinico = None
        fake_case.resultados_pruebas = None
        fake_case.sexo = "M"
        fake_case.signos = None
        fake_case.sintomas = None
        fake_case.situacion_basal = None
        fake_case.tratamiento_farmacologico = None
        fake_case.tratamiento_no_farmacologico = None
        MockService.return_value.get_case_by_id.return_value = (
            fake_case
        )

        response = client.get("/cases/1", headers=_auth_header())

        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == 1
        assert data["motivo"] == "Dolor torácico"

    @patch("app.routes.case_routes.CaseService")
    def test_returns_404_when_not_found(self, MockService, client):
        MockService.return_value.get_case_by_id.return_value = None

        response = client.get(
            "/cases/999", headers=_auth_header()
        )

        assert response.status_code == 404

    def test_returns_401_without_token(self, client):
        response = client.get("/cases/1")

        assert response.status_code == 401


class TestGetCaseCount:
    """Tests para GET /cases/count"""

    @patch("app.routes.case_routes.CaseService")
    def test_returns_200_with_count(self, MockService, client):
        MockService.return_value.get_case_count.return_value = 150

        response = client.get(
            "/cases/count", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["cantidad_casos"] == 150


class TestGetNextCase:
    """Tests para GET /cases/next"""

    @patch("app.routes.case_routes.CaseService")
    def test_returns_200_when_available(self, MockService, client):
        fake_case = MagicMock()
        fake_case.id = 5
        fake_case.alergias = None
        fake_case.antecedentes_familiares = None
        fake_case.antecedentes_medicos = None
        fake_case.antecedentes_quirurgicos = None
        fake_case.categoria = None
        fake_case.diagnostico_final = None
        fake_case.dificultad = None
        fake_case.edad = 30
        fake_case.exploracion_general = None
        fake_case.factores_sociales = None
        fake_case.habitos = None
        fake_case.medicacion_actual = None
        fake_case.motivo = "Fiebre"
        fake_case.razonamiento_clinico = None
        fake_case.resultados_pruebas = None
        fake_case.sexo = "F"
        fake_case.signos = None
        fake_case.sintomas = None
        fake_case.situacion_basal = None
        fake_case.tratamiento_farmacologico = None
        fake_case.tratamiento_no_farmacologico = None
        MockService.return_value.get_next_case_for_user.return_value = (
            fake_case
        )

        response = client.get(
            "/cases/next", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["motivo"] == "Fiebre"

    @patch("app.routes.case_routes.CaseService")
    def test_returns_404_when_none(self, MockService, client):
        MockService.return_value.get_next_case_for_user.return_value = (
            None
        )

        response = client.get(
            "/cases/next", headers=_auth_header()
        )

        assert response.status_code == 404
