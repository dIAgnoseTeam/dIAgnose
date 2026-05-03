from unittest.mock import MagicMock

from app.schemas.case_schema import case_to_dict
from app.schemas.review_schema import review_to_dict
from app.schemas.role_schema import role_to_dict
from app.schemas.user_schema import user_to_dict


class TestCaseToDict:
    """Tests para case_to_dict"""

    def test_case_to_dict_returns_all_fields(self):
        mock_case = MagicMock()
        mock_case.id = 1
        mock_case.alergias = "Penicilina"
        mock_case.antecedentes_familiares = "Diabetes"
        mock_case.antecedentes_medicos = "Hipertensión"
        mock_case.antecedentes_quirurgicos = "Apendicectomía"
        mock_case.categoria = "Cardiología"
        mock_case.diagnostico_final = "Angina de pecho"
        mock_case.dificultad = "Alta"
        mock_case.edad = 55
        mock_case.exploracion_general = "Normal"
        mock_case.factores_sociales = "Fumador"
        mock_case.habitos = "Sedentario"
        mock_case.medicacion_actual = "Enalapril"
        mock_case.motivo = "Dolor torácico"
        mock_case.razonamiento_clinico = "Sospecha de SCA"
        mock_case.resultados_pruebas = "ECG alterado"
        mock_case.sexo = "M"
        mock_case.signos = "Taquicardia"
        mock_case.sintomas = "Dolor opresivo"
        mock_case.situacion_basal = "Independiente"
        mock_case.tratamiento_farmacologico = "Nitroglicerina"
        mock_case.tratamiento_no_farmacologico = "Reposo"

        result = case_to_dict(mock_case)

        assert result["id"] == 1
        assert result["motivo"] == "Dolor torácico"
        assert result["diagnostico_final"] == "Angina de pecho"
        assert result["edad"] == 55
        assert result["sexo"] == "M"
        assert len(result) == 22


class TestReviewToDict:
    """Tests para review_to_dict"""

    def test_review_to_dict_returns_all_fields(self):
        mock_review = MagicMock()
        mock_review.id = 1
        mock_review.id_usuario = 5
        mock_review.id_caso = 10
        mock_review.puntuacion = 8
        mock_review.mensaje = "Buen caso"
        mock_review.precision_diagnostica = 9
        mock_review.claridad_textual = 7
        mock_review.relevancia_clinica = 8
        mock_review.adecuacion_contextual = 7
        mock_review.nivel_tecnico = 8

        result = review_to_dict(mock_review)

        assert result["id"] == 1
        assert result["id_usuario"] == 5
        assert result["id_caso"] == 10
        assert result["puntuacion"] == 8
        assert result["mensaje"] == "Buen caso"
        assert result["precision_diagnostica"] == 9
        assert len(result) == 10


class TestRoleToDict:
    """Tests para role_to_dict"""

    def test_role_to_dict_returns_all_fields(self):
        mock_role = MagicMock()
        mock_role.id = 1
        mock_role.nombre = "admin"

        result = role_to_dict(mock_role)

        assert result["id"] == 1
        assert result["nombre"] == "admin"
        assert len(result) == 2


class TestUserToDict:
    """Tests para user_to_dict"""

    def test_user_to_dict_returns_all_fields(self):
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.nombre = "Juan"
        mock_user.correo = "juan@test.com"
        mock_user.id_rol = 3

        result = user_to_dict(mock_user)

        assert result["id"] == 1
        assert result["nombre"] == "Juan"
        assert result["correo"] == "juan@test.com"
        assert result["id_rol"] == 3
        assert len(result) == 4
