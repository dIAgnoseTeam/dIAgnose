import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { reviewService } from "../../services/api";
import { useParams, useNavigate } from "react-router";

function CaseForm() {
  const initialScore = {
    puntuacion: 1,
    precision_diagnostica: 1,
    claridad_textual: 1,
    relevancia_clinica: 1,
    adecuacion_contextual: 1,
    nivel_tecnico: 1,
    mensaje: "",
  };

  const numericFields = [
    "puntuacion",
    "precision_diagnostica",
    "claridad_textual",
    "relevancia_clinica",
    "adecuacion_contextual",
    "nivel_tecnico",
  ];

  const { user } = useAuth();
  const { idCase } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(initialScore);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScore((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = {
      id_usuario: user.id,
      id_caso: idCase,
      ...score,
    };

    await reviewService.createReview(review);
    setScore(initialScore);
    navigate("/");
  };

  return (
    <section className="bg-white rounded-xl border border-gray-100 my-8 p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Valoración del caso clínico
      </h2>
      <p className="text-sm text-gray-400 mb-6 pb-5 border-b border-gray-100">
        Evalúa cada apartado del 1 al 5
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-teal-700">
              Puntuación {score.puntuacion}
            </p>
            <span className="text-2xl font-bold text-teal-600">
              {score.puntuacion}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-600"
            type="range"
            name="puntuacion"
            min={1}
            max={5}
            step={1}
            value={score.puntuacion}
            onChange={handleChange}
            required
          />
          <div className="flex justify-between text-xs text-teal-400 mt-1">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              Precisión del diagnóstico
            </p>
            <span className="text-base font-bold text-teal-500">
              {score.precision_diagnostica}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-500"
            type="range"
            name="precision_diagnostica"
            min={1}
            max={5}
            step={1}
            value={score.precision_diagnostica}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              Claridad Textual
            </p>
            <span className="text-base font-bold text-teal-500">
              {score.claridad_textual}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-500"
            type="range"
            name="claridad_textual"
            min={1}
            max={5}
            step={1}
            value={score.claridad_textual}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              Relevancia clínica
            </p>
            <span className="text-base font-bold text-teal-500">
              {score.relevancia_clinica}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-500"
            type="range"
            name="relevancia_clinica"
            min={1}
            max={5}
            step={1}
            value={score.relevancia_clinica}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              Adecuación contextual
            </p>
            <span className="text-base font-bold text-teal-500">
              {score.adecuacion_contextual}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-500"
            type="range"
            name="adecuacion_contextual"
            min={1}
            max={5}
            step={1}
            value={score.adecuacion_contextual}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">Nivel técnico</p>
            <span className="text-base font-bold text-teal-500">
              {score.nivel_tecnico}
              <span className="text-xs text-gray-400 font-normal">/5</span>
            </span>
          </div>
          <input
            className="w-full accent-teal-500"
            type="range"
            name="nivel_tecnico"
            min={1}
            max={5}
            step={1}
            value={score.nivel_tecnico}
            onChange={handleChange}
            required
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mensaje
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none transition"
            name="mensaje"
            rows={4}
            placeholder="Escribe tus observaciones aquí"
            required
            value={score.mensaje}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 shadow-sm"
            type="submit"
          >
            Enviar valoración
          </button>
        </div>
      </form>
    </section>
  );
}

export default CaseForm;
