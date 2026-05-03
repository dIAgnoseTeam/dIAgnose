import pytest

from app import create_app


@pytest.fixture
def app():
    """Crea una instancia de la app Flask en modo testing."""
    app = create_app()
    app.config["TESTING"] = True
    yield app


@pytest.fixture
def client(app):
    """Cliente HTTP falso — simula peticiones sin arrancar servidor."""
    return app.test_client()
