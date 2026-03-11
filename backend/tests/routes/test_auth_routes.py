from app.utils.oauth_decorator import create_token


def _make_token():
    return create_token({
        "id": "123",
        "email": "test@test.com",
        "name": "Test User",
        "picture": "http://example.com/pic.jpg",
    })


def _auth_header():
    return {"Authorization": f"Bearer {_make_token()}"}


class TestGetMe:
    """Tests para GET /auth/me"""

    def test_returns_200_with_valid_token(self, client):
        response = client.get(
            "/auth/me", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["email"] == "test@test.com"
        assert data["user"]["name"] == "Test User"

    def test_returns_401_without_token(self, client):
        response = client.get("/auth/me")

        assert response.status_code == 401


class TestLogout:
    """Tests para POST /auth/logout"""

    def test_returns_200_with_token(self, client):
        response = client.post(
            "/auth/logout", headers=_auth_header()
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["message"] == "Logged out successfully"
