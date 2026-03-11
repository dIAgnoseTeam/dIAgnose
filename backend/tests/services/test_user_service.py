from unittest.mock import MagicMock, patch

from app.services.user_service import UserService


class TestGetUserById:
    """Tests para get_user_by_id"""

    @patch("app.services.user_service.UserRepository")
    def test_returns_user_when_found(self, MockRepo):
        fake_user = MagicMock()
        fake_user.id = 1
        fake_user.nombre = "Juan"
        fake_user.correo = "juan@test.com"
        MockRepo.return_value.get_user_by_id.return_value = fake_user

        service = UserService()
        result = service.get_user_by_id(1)

        assert result.id == 1
        assert result.nombre == "Juan"

    @patch("app.services.user_service.UserRepository")
    def test_returns_none_when_not_found(self, MockRepo):
        MockRepo.return_value.get_user_by_id.return_value = None

        service = UserService()
        result = service.get_user_by_id(999)

        assert result is None


class TestGetUsersCount:
    """Tests para get_users_count"""

    @patch("app.services.user_service.UserRepository")
    def test_returns_count(self, MockRepo):
        MockRepo.return_value.get_users_count.return_value = 25

        service = UserService()
        result = service.get_users_count()

        assert result == 25


class TestCreateOrUpdateUser:
    """Tests para create_or_update_user"""

    @patch("app.services.user_service.UserRepository")
    def test_creates_new_user(self, MockRepo):
        fake_user = MagicMock()
        fake_user.correo = "nuevo@test.com"
        fake_user.nombre = "Nuevo"
        MockRepo.return_value.create_or_update.return_value = (
            fake_user
        )

        service = UserService()
        result = service.create_or_update_user(
            "nuevo@test.com", "Nuevo"
        )

        assert result.correo == "nuevo@test.com"
        assert result.nombre == "Nuevo"

    @patch("app.services.user_service.UserRepository")
    def test_updates_existing_user(self, MockRepo):
        fake_user = MagicMock()
        fake_user.correo = "existe@test.com"
        fake_user.nombre = "NombreActualizado"
        MockRepo.return_value.create_or_update.return_value = (
            fake_user
        )

        service = UserService()
        result = service.create_or_update_user(
            "existe@test.com", "NombreActualizado"
        )

        assert result.nombre == "NombreActualizado"
