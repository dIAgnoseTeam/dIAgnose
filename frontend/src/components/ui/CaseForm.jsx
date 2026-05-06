import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCaseContext } from "../../contexts/CaseContext";
import { reviewService } from "../../services/api";
import { useToast } from "../../hooks/useToast";
import Toast from "./Toast";
import Slider from "@mui/material/Slider";
import { DynamicIcon } from "./DynamicIcon";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScore((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setScore((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      onReviewSubmitted(); // Esto carga el siguiente caso asincrónicamente sin recargar la página
    } catch (err) {
      const msg = err.response?.data?.error || "Error al enviar la valoración";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm h-auto xl:h-[calc(100dvh-6.5rem)] xl:max-h-[calc(100dvh-6.5rem)] flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 pb-4 sm:pb-5 border-b border-gray-100 shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
          Valoración del caso clínico
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Evalúa cada apartado del 1 al 5
        </p>
      </div>

      <form
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
          <Slider
            size="small"
            value={score.puntuacion}
            onChange={handleSliderChange("puntuacion")}
            min={1}
            max={5}
            step={1}
            valueLabelDisplay="auto"
            sx={{
              color: "#14B8A6",
              "& .MuiSlider-thumb": {
                backgroundColor: "#14B8A6",
              },
            }}
          />
          <div className="flex justify-between text-xs text-teal-400 mt-1">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {scoreFields.map(({ name, label, fullWidth }) => (
            <div
              key={name}
              className={`flex flex-col justify-between bg-gray-50 border border-gray-100 rounded-lg p-3 sm:p-4 ${fullWidth ? "sm:col-span-2" : ""}`}
            >
              <div className="flex justify-between items-center mb-2 gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {label}
                </p>
                <span className="text-sm sm:text-base font-bold text-teal-500 shrink-0">
                  {score[name]}
                  <span className="text-xs text-gray-400 font-normal">/5</span>
                </span>
              </div>
              <Slider
                size="small"
                value={score[name]}
                onChange={handleSliderChange(name)}
                min={1}
                max={5}
                step={1}
                valueLabelDisplay="auto"
                sx={{
                  color: "#14B8A6",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#14B8A6",
                  },
                }}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
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

        <div className="sticky bottom-0 bg-white">
          <div className="flex justify-end">
            <button
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold py-2.5 px-4 sm:px-6 rounded-lg transition-colors duration-150 shadow-sm w-full sm:w-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <DynamicIcon
                    name="Loader"
                    size={16}
                    className="animate-spin"
                  />
                  Enviando...
                </span>
              ) : (
                "Enviar valoración"
              )}
            </button>
          </div>
        </div>
      </form>
      <Toast toast={toast} />
    </section>
  );
}

export default CaseForm;
