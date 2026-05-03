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


class TestGetRoleById:
    """Tests para GET /roles/<id>"""

    @patch("app.routes.role_routes.RoleService")
    def test_returns_200_when_found(self, MockService, client):
        fake_role = MagicMock()
        fake_role.id = 1
        fake_role.nombre = "admin"
        MockService.return_value.get_role_by_id.return_value = (
            fake_role
        )

        response = client.get(
            "/roles/1", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["nombre"] == "admin"

    @patch("app.routes.role_routes.RoleService")
    def test_returns_404_when_not_found(self, MockService, client):
        MockService.return_value.get_role_by_id.return_value = None

        response = client.get(
            "/roles/999", headers=_auth_header()
        )

        assert response.status_code == 404


class TestGetRolesCount:
    """Tests para GET /roles/count"""

    @patch("app.routes.role_routes.RoleService")
    def test_returns_200_with_count(self, MockService, client):
        MockService.return_value.get_roles_count.return_value = 3

        response = client.get(
            "/roles/count", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["count"] == 3
