import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCaseContext } from "../../contexts/CaseContext";
import { reviewService } from "../../services/api";
import { useToast } from "../../hooks/useToast";
import Toast from "./Toast";

function CaseForm({ idCase }) {
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

  const scoreFields = [
    { name: "precision_diagnostica", label: "Precisión del diagnóstico" },
    { name: "claridad_textual", label: "Claridad textual" },
    { name: "relevancia_clinica", label: "Relevancia clínica" },
    { name: "adecuacion_contextual", label: "Adecuación contextual" },
    { name: "nivel_tecnico", label: "Nivel técnico", fullWidth: true },
  ];

  const { user } = useAuth();
  const { onReviewSubmitted } = useCaseContext();
  const [score, setScore] = useState(initialScore);
  const { toast, showToast } = useToast();

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

    try {
      await reviewService.createReview(review);
      setScore(initialScore);
      showToast("Valoración enviada correctamente");
      // Hacemos un sleep de 1.5s para que el usuario vea el toast antes de cargar el siguiente caso
      await new Promise((resolve) => setTimeout(resolve, 1600));
      onReviewSubmitted();
    } catch (err) {
      const msg = err.response?.data?.error || "Error al enviar la valoración";
      showToast(msg, "error");
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm h-[calc(100vh-6.5rem)] max-h-[calc(100vh-6.5rem)] flex flex-col overflow-hidden">
      <div className="p-6 pb-5 border-b border-gray-100 shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Valoración del caso clínico
        </h2>
        <p className="text-sm text-gray-400">Evalúa cada apartado del 1 al 5</p>
      </div>

      <form
        className="flex-1 overflow-y-auto p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-teal-700">Puntuación</p>
            <span className="text-xl font-bold text-teal-600">
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

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {scoreFields.map(({ name, label, fullWidth }) => (
            <div
              key={name}
              className={`flex flex-col justify-between bg-gray-50 border border-gray-100 rounded-lg p-4 ${fullWidth ? "xl:col-span-2" : ""}`}
            >
              <div className="flex justify-between items-center mb-2 gap-3">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <span className="text-base font-bold text-teal-500 shrink-0">
                  {score[name]}
                  <span className="text-xs text-gray-400 font-normal">/5</span>
                </span>
              </div>
              <input
                className="w-full accent-teal-500"
                type="range"
                name={name}
                min={1}
                max={5}
                step={1}
                value={score[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mensaje
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none transition"
            name="mensaje"
            rows={3}
            placeholder="Escribe tus observaciones aquí"
            value={score.mensaje}
            onChange={handleChange}
          />
        </div>

        <div className="sticky bottom-0 bg-white pt-4">
          <div className="flex justify-end">
            <button
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 shadow-sm"
              type="submit"
            >
              Enviar valoración
            </button>
          </div>
        </div>
      </form>
      <Toast toast={toast} />
    </section>
  );
}

export default CaseForm;
