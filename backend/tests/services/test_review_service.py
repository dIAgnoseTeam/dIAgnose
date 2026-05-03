from unittest.mock import MagicMock, patch

from app.services.review_service import ReviewService


class TestGetAllReviews:
    """Tests para get_all_reviews"""

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_list(self, MockRepo):
        fake_reviews = [MagicMock(), MagicMock()]
        MockRepo.return_value.get_all.return_value = fake_reviews

        service = ReviewService()
        result = service.get_all_reviews(10, 0)

        assert len(result) == 2


class TestGetReviewById:
    """Tests para get_review_by_id"""

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_review_when_found(self, MockRepo):
        fake_review = MagicMock()
        fake_review.id = 1
        MockRepo.return_value.get_by_id.return_value = fake_review

        service = ReviewService()
        result = service.get_review_by_id(1)

        assert result.id == 1

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_none_when_not_found(self, MockRepo):
        MockRepo.return_value.get_by_id.return_value = None

        service = ReviewService()
        result = service.get_review_by_id(999)

        assert result is None


class TestCreateReview:
    """Tests para create_review"""

    @patch("app.services.review_service.ReviewRepository")
    def test_creates_and_returns_review(self, MockRepo):
        fake_review = MagicMock()
        fake_review.id = 1
        fake_review.puntuacion = 8
        MockRepo.return_value.create.return_value = fake_review

        data = {
            "id_caso": 10,
            "id_usuario": 5,
            "puntuacion": 8,
            "precision_diagnostica": 9,
            "claridad_textual": 7,
            "relevancia_clinica": 8,
            "adecuacion_contextual": 7,
            "nivel_tecnico": 8,
        }
        service = ReviewService()
        result = service.create_review(data)

        assert result.id == 1
        assert result.puntuacion == 8


class TestGetReviewsByUserId:
    """Tests para get_reviews_by_user_id"""

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_user_reviews(self, MockRepo):
        fake_reviews = [MagicMock(), MagicMock(), MagicMock()]
        MockRepo.return_value.get_by_user.return_value = fake_reviews

        service = ReviewService()
        result = service.get_reviews_by_user_id(5)

        assert len(result) == 3


class TestCountReviewsByCase:
    """Tests para count_reviews_by_case"""

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_count(self, MockRepo):
        MockRepo.return_value.count_reviews_by_case.return_value = 2

        service = ReviewService()
        result = service.count_reviews_by_case(10)

        assert result == 2


class TestUserHasReviewedCase:
    """Tests para user_has_reviewed_case"""

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_true_when_reviewed(self, MockRepo):
        MockRepo.return_value.user_has_reviewed_case.return_value = (
            True
        )

        service = ReviewService()
        result = service.user_has_reviewed_case(5, 10)

        assert result is True

    @patch("app.services.review_service.ReviewRepository")
    def test_returns_false_when_not_reviewed(self, MockRepo):
        MockRepo.return_value.user_has_reviewed_case.return_value = (
            False
        )

        service = ReviewService()
        result = service.user_has_reviewed_case(5, 99)

        assert result is False
