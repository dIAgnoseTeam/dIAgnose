from unittest.mock import MagicMock, patch

import pandas as pd
import pytest


class TestGetRegistro:
    """Tests para DatasetRepository.get_registro"""

    @patch("app.repositories.dataset_repository.load_dataset")
    @patch("app.repositories.dataset_repository.Config")
    def test_returns_correct_row(self, MockConfig, mock_load):
        MockConfig.HF_TOKEN = None
        fake_df = pd.DataFrame([
            {"motivo": "Fiebre", "edad": 30, "sexo": "F"},
            {"motivo": "Cefalea", "edad": 45, "sexo": "M"},
            {"motivo": "Disnea", "edad": 60, "sexo": "F"},
        ])
        mock_split = MagicMock()
        mock_split.to_pandas.return_value = fake_df
        mock_load.return_value = {"train": mock_split}

        from app.repositories.dataset_repository import (
            DatasetRepository,
        )

        repo = DatasetRepository()
        result = repo.get_registro(0)

        assert result["motivo"] == "Fiebre"
        assert result["edad"] == 30

    @patch("app.repositories.dataset_repository.load_dataset")
    @patch("app.repositories.dataset_repository.Config")
    def test_returns_last_row(self, MockConfig, mock_load):
        MockConfig.HF_TOKEN = None
        fake_df = pd.DataFrame([
            {"motivo": "Fiebre", "edad": 30},
            {"motivo": "Cefalea", "edad": 45},
            {"motivo": "Disnea", "edad": 60},
        ])
        mock_split = MagicMock()
        mock_split.to_pandas.return_value = fake_df
        mock_load.return_value = {"train": mock_split}

        from app.repositories.dataset_repository import (
            DatasetRepository,
        )

        repo = DatasetRepository()
        result = repo.get_registro(2)

        assert result["motivo"] == "Disnea"

    @patch("app.repositories.dataset_repository.load_dataset")
    @patch("app.repositories.dataset_repository.Config")
    def test_negative_index_raises(self, MockConfig, mock_load):
        MockConfig.HF_TOKEN = None
        fake_df = pd.DataFrame([{"motivo": "Fiebre"}])
        mock_split = MagicMock()
        mock_split.to_pandas.return_value = fake_df
        mock_load.return_value = {"train": mock_split}

        from app.repositories.dataset_repository import (
            DatasetRepository,
        )

        repo = DatasetRepository()

        with pytest.raises(IndexError):
            repo.get_registro(-1)

    @patch("app.repositories.dataset_repository.load_dataset")
    @patch("app.repositories.dataset_repository.Config")
    def test_out_of_range_raises(self, MockConfig, mock_load):
        MockConfig.HF_TOKEN = None
        fake_df = pd.DataFrame([{"motivo": "Fiebre"}])
        mock_split = MagicMock()
        mock_split.to_pandas.return_value = fake_df
        mock_load.return_value = {"train": mock_split}

        from app.repositories.dataset_repository import (
            DatasetRepository,
        )

        repo = DatasetRepository()

        with pytest.raises(IndexError):
            repo.get_registro(999)


class TestGetMaxRegister:
    """Tests para DatasetRepository.get_max_register"""

    @patch("app.repositories.dataset_repository.load_dataset")
    @patch("app.repositories.dataset_repository.Config")
    def test_returns_row_count(self, MockConfig, mock_load):
        MockConfig.HF_TOKEN = None
        fake_df = pd.DataFrame([
            {"motivo": "Fiebre"},
            {"motivo": "Cefalea"},
            {"motivo": "Disnea"},
        ])
        mock_split = MagicMock()
        mock_split.to_pandas.return_value = fake_df
        mock_load.return_value = {"train": mock_split}

        from app.repositories.dataset_repository import (
            DatasetRepository,
        )

        repo = DatasetRepository()
        result = repo.get_max_register()

        assert result == 3
