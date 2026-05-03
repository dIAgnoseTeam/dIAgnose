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


class TestGetUserById:
    """Tests para GET /users/<id>"""

    @patch("app.routes.user_routes.UserService")
    def test_returns_200_when_found(self, MockService, client):
        fake_user = MagicMock()
        fake_user.id = 1
        fake_user.nombre = "Juan"
        fake_user.correo = "juan@test.com"
        fake_user.id_rol = 3
        MockService.return_value.get_user_by_id.return_value = (
            fake_user
        )

        response = client.get(
            "/users/1", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["nombre"] == "Juan"

    @patch("app.routes.user_routes.UserService")
    def test_returns_404_when_not_found(self, MockService, client):
        MockService.return_value.get_user_by_id.return_value = None

        response = client.get(
            "/users/999", headers=_auth_header()
        )

        assert response.status_code == 404


class TestGetUserCount:
    """Tests para GET /users/count"""

    @patch("app.routes.user_routes.UserService")
    def test_returns_200_with_count(self, MockService, client):
        MockService.return_value.get_users_count.return_value = 25

        response = client.get(
            "/users/count", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["cantidad_usuarios"] == 25
