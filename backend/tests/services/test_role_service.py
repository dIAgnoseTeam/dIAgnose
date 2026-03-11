from unittest.mock import MagicMock, patch

from app.services.role_service import RoleService


class TestGetRoleById:
    """Tests para get_role_by_id"""

    @patch("app.services.role_service.RoleRepository")
    def test_returns_role_when_found(self, MockRepo):
        fake_role = MagicMock()
        fake_role.id = 1
        fake_role.nombre = "admin"
        MockRepo.return_value.get_role_by_id.return_value = fake_role

        service = RoleService()
        result = service.get_role_by_id(1)

        assert result.id == 1
        assert result.nombre == "admin"

    @patch("app.services.role_service.RoleRepository")
    def test_returns_none_when_not_found(self, MockRepo):
        MockRepo.return_value.get_role_by_id.return_value = None

        service = RoleService()
        result = service.get_role_by_id(999)

        assert result is None


class TestGetRolesCount:
    """Tests para get_roles_count"""

    @patch("app.services.role_service.RoleRepository")
    def test_returns_count(self, MockRepo):
        MockRepo.return_value.get_roles_count.return_value = 3

        service = RoleService()
        result = service.get_roles_count()

        assert result == 3
