from unittest.mock import MagicMock, patch

from app.utils.oauth_decorator import create_token


def _make_token():
    return create_token({
        "id": "123",
        "email": "test@test.com",
        "name": "Test User",
    })


def _auth_header():
    return {"Authorization": f"Bearer {_make_token()}"}


class TestGetReviews:
    """Tests para GET /reviews/"""

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_200_with_list(self, MockService, client):
        r1 = MagicMock()
        r1.id = 1
        r1.id_usuario = 5
        r1.id_caso = 10
        r1.puntuacion = 8
        r1.mensaje = "Bien"
        r1.precision_diagnostica = 9
        r1.claridad_textual = 7
        r1.relevancia_clinica = 8
        r1.adecuacion_contextual = 7
        r1.nivel_tecnico = 8
        MockService.return_value.get_all_reviews.return_value = [r1]

        response = client.get(
            "/reviews/", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["count"] == 1


class TestGetReviewById:
    """Tests para GET /reviews/<id>"""

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_200_when_found(self, MockService, client):
        fake = MagicMock()
        fake.id = 1
        fake.id_usuario = 5
        fake.id_caso = 10
        fake.puntuacion = 8
        fake.mensaje = None
        fake.precision_diagnostica = 9
        fake.claridad_textual = 7
        fake.relevancia_clinica = 8
        fake.adecuacion_contextual = 7
        fake.nivel_tecnico = 8
        MockService.return_value.get_review_by_id.return_value = (
            fake
        )

        response = client.get(
            "/reviews/1", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == 1

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_404_when_not_found(self, MockService, client):
        MockService.return_value.get_review_by_id.return_value = (
            None
        )

        response = client.get(
            "/reviews/999", headers=_auth_header()
        )

        assert response.status_code == 404


class TestGetUserReviews:
    """Tests para GET /reviews/user/<id>"""

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_200(self, MockService, client):
        MockService.return_value.get_reviews_by_user_id.return_value = []

        response = client.get(
            "/reviews/user/5", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["count"] == 0


class TestCreateReview:
    """Tests para POST /reviews/create"""

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_201_on_success(self, MockService, client):
        fake = MagicMock()
        fake.id = 1
        fake.id_usuario = 123
        fake.id_caso = 10
        fake.puntuacion = 8
        fake.mensaje = None
        fake.precision_diagnostica = 9
        fake.claridad_textual = 7
        fake.relevancia_clinica = 8
        fake.adecuacion_contextual = 7
        fake.nivel_tecnico = 8
        MockService.return_value.create_review.return_value = fake
        MockService.return_value.user_has_reviewed_case.return_value = (
            False
        )
        MockService.return_value.count_reviews_by_case.return_value = 0

        review_data = {
            "id_caso": 10,
            "id_usuario": 123,
            "puntuacion": 8,
            "precision_diagnostica": 9,
            "claridad_textual": 7,
            "relevancia_clinica": 8,
            "adecuacion_contextual": 7,
            "nivel_tecnico": 8,
        }
        response = client.post(
            "/reviews/create",
            json=review_data,
            headers=_auth_header(),
        )

        assert response.status_code == 201

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_400_missing_field(self, MockService, client):
        incomplete_data = {
            "id_caso": 10,
            "id_usuario": 123,
            # falta puntuacion y el resto
        }
        response = client.post(
            "/reviews/create",
            json=incomplete_data,
            headers=_auth_header(),
        )

        assert response.status_code == 400
        data = response.get_json()
        assert "Falta el campo requerido" in data["error"]

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_409_already_reviewed(
        self, MockService, client
    ):
        MockService.return_value.user_has_reviewed_case.return_value = (
            True
        )

        review_data = {
            "id_caso": 10,
            "id_usuario": 123,
            "puntuacion": 8,
            "precision_diagnostica": 9,
            "claridad_textual": 7,
            "relevancia_clinica": 8,
            "adecuacion_contextual": 7,
            "nivel_tecnico": 8,
        }
        response = client.post(
            "/reviews/create",
            json=review_data,
            headers=_auth_header(),
        )

        assert response.status_code == 409
        data = response.get_json()
        assert "Ya has revisado" in data["error"]

    @patch("app.routes.review_routes.ReviewService")
    def test_returns_409_max_reviews_reached(
        self, MockService, client
    ):
        MockService.return_value.user_has_reviewed_case.return_value = (
            False
        )
        MockService.return_value.count_reviews_by_case.return_value = 3

        review_data = {
            "id_caso": 10,
            "id_usuario": 123,
            "puntuacion": 8,
            "precision_diagnostica": 9,
            "claridad_textual": 7,
            "relevancia_clinica": 8,
            "adecuacion_contextual": 7,
            "nivel_tecnico": 8,
        }
        response = client.post(
            "/reviews/create",
            json=review_data,
            headers=_auth_header(),
        )

        assert response.status_code == 409
        data = response.get_json()
        assert "máximo de veces" in data["error"]
