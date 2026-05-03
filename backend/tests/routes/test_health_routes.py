class TestHello:
    """Tests para GET /health/hello"""

    def test_hello_returns_200(self, client):
        response = client.get("/health/hello")
        assert response.status_code == 200

    def test_hello_returns_correct_message(self, client):
        response = client.get("/health/hello")
        data = response.get_json()
        assert data["message"] == "Hola mundo!"


class TestHealthCheck:
    """Tests para GET /health/health"""

    def test_health_check_returns_200(self, client):
        response = client.get("/health/health")
        assert response.status_code == 200

    def test_health_check_returns_status_ok(self, client):
        response = client.get("/health/health")
        data = response.get_json()
        assert data["status"] == "OK"

    def test_health_check_returns_correct_message(self, client):
        response = client.get("/health/health")
        data = response.get_json()
        assert data["message"] == "El servicio esta operativo."
