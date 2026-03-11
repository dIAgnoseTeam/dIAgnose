from unittest.mock import MagicMock, patch

from app.services.case_service import CaseService


class TestGetCaseById:
    """Tests para get_case_by_id"""

    @patch("app.services.case_service.CaseRepository")
    def test_returns_case_when_found(self, MockRepo):
        fake_case = MagicMock()
        fake_case.id = 1
        fake_case.motivo = "Dolor torácico"
        MockRepo.return_value.get_case_by_id.return_value = fake_case

        service = CaseService()
        result = service.get_case_by_id(1)

        assert result.id == 1
        assert result.motivo == "Dolor torácico"

    @patch("app.services.case_service.CaseRepository")
    def test_returns_none_when_not_found(self, MockRepo):
        MockRepo.return_value.get_case_by_id.return_value = None

        service = CaseService()
        result = service.get_case_by_id(999)

        assert result is None


class TestGetCaseCount:
    """Tests para get_case_count"""

    @patch("app.services.case_service.CaseRepository")
    def test_returns_count(self, MockRepo):
        MockRepo.return_value.get_case_count.return_value = 150

        service = CaseService()
        result = service.get_case_count()

        assert result == 150


class TestCreateNewCase:
    """Tests para create_new_case"""

    @patch("app.services.case_service.CaseRepository")
    def test_creates_and_returns_case(self, MockRepo):
        fake_case = MagicMock()
        fake_case.id = 10
        fake_case.motivo = "Fiebre"
        MockRepo.return_value.create_case.return_value = fake_case

        caso_data = {"motivo": "Fiebre", "edad": 30, "sexo": "F"}
        service = CaseService()
        result = service.create_new_case(caso_data)

        assert result.id == 10
        assert result.motivo == "Fiebre"


class TestCaseAlreadyExists:
    """Tests para case_already_exists"""

    @patch("app.services.case_service.CaseRepository")
    def test_returns_true_when_exists(self, MockRepo):
        MockRepo.return_value.case_exists.return_value = True

        service = CaseService()
        result = service.case_already_exists(
            "Fiebre", "Gripe", 30, "M"
        )

        assert result is True

    @patch("app.services.case_service.CaseRepository")
    def test_returns_false_when_not_exists(self, MockRepo):
        MockRepo.return_value.case_exists.return_value = False

        service = CaseService()
        result = service.case_already_exists(
            "Fiebre", "Gripe", 30, "M"
        )

        assert result is False


class TestGetNextCaseForUser:
    """Tests para get_next_case_for_user"""

    @patch("app.services.case_service.CaseRepository")
    def test_returns_case_when_available(self, MockRepo):
        fake_case = MagicMock()
        fake_case.id = 5
        MockRepo.return_value.get_next_case_for_user.return_value = (
            fake_case
        )

        service = CaseService()
        result = service.get_next_case_for_user(42)

        assert result is not None
        assert result.id == 5

    @patch("app.services.case_service.CaseRepository")
    def test_returns_none_when_all_reviewed(self, MockRepo):
        MockRepo.return_value.get_next_case_for_user.return_value = (
            None
        )

        service = CaseService()
        result = service.get_next_case_for_user(42)

        assert result is None
