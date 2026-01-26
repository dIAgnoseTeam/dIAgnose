from app.repositories.review_repository import ReviewRepository


class ReviewService:
    def __init__(self):
        self.review_repository = ReviewRepository()

    def get_all_reviews(self, limit: int = 100, offset: int = 0):
        return self.review_repository.get_all(limit, offset)

    def get_review_by_id(self, valoracion_id: int):
        return self.review_repository.get_by_id(valoracion_id)

    def create_review(self, valoracion_dict: dict):
        return self.review_repository.create(valoracion_dict)

    def get_reviews_by_user_id(self, user_id: int):
        return self.review_repository.get_by_user(user_id)
