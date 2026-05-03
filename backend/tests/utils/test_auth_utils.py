from datetime import datetime, timedelta

import jwt

from app.config import Config
from app.utils.oauth_decorator import create_token


class TestCreateToken:
    """Tests para create_token"""

    def test_create_token_returns_string(self):
        user_data = {
            "id": "123",
            "email": "test@test.com",
            "name": "Test User",
        }
        token = create_token(user_data)

        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_token_contains_correct_claims(self):
        user_data = {
            "id": "123",
            "email": "test@test.com",
            "name": "Test User",
            "picture": "http://example.com/pic.jpg",
        }
        token = create_token(user_data)
        payload = jwt.decode(
            token, Config.JWT_SECRET_KEY, algorithms=["HS256"]
        )

        assert payload["user_id"] == "123"
        assert payload["email"] == "test@test.com"
        assert payload["name"] == "Test User"
        assert "exp" in payload
        assert "iat" in payload


class TestTokenRequired:
    """Tests para el decorador @token_required"""

    def test_missing_token_returns_401(self, client):
        response = client.get("/health/hello")
        # health no usa @token_required, así que
        # usamos una ruta protegida: /cases/count
        response = client.get("/cases/count")

        assert response.status_code == 401
        data = response.get_json()
        assert data["message"] == "Token is missing"

    def test_invalid_token_returns_401(self, client):
        response = client.get(
            "/cases/count",
            headers={"Authorization": "Bearer tokenfalso123"},
        )

        assert response.status_code == 401
        data = response.get_json()
        assert data["message"] == "Token is invalid"

    def test_valid_token_passes(self, client):
        user_data = {
            "id": "123",
            "email": "test@test.com",
            "name": "Test User",
        }
        token = create_token(user_data)
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["email"] == "test@test.com"

    def test_expired_token_returns_401(self, client):
        payload = {
            "user_id": "123",
            "email": "test@test.com",
            "name": "Test User",
            "exp": datetime.utcnow() - timedelta(days=1),
            "iat": datetime.utcnow() - timedelta(days=2),
        }
        expired_token = jwt.encode(
            payload, Config.JWT_SECRET_KEY, algorithm="HS256"
        )
        response = client.get(
            "/cases/count",
            headers={
                "Authorization": f"Bearer {expired_token}"
            },
        )

        assert response.status_code == 401
        data = response.get_json()
        assert data["message"] == "Token has expired"
