import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { datasetService } from "../../services/api";
import { CASE_SECTIONS } from "../../config/caseConfig";
import { DynamicIcon } from "./DynamicIcon";

const CaseField = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </p>
    </div>
  );
};

const CaseSection = ({ section, data }) => {
  const hasContent = section.fields.some(
    (f) => data[f.key] != null && data[f.key] !== "",
  );
  if (!hasContent) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
        <DynamicIcon name={section.icon} size={14} className="text-teal-600" />
        <h3 className="text-xs font-semibold text-gray-800">{section.title}</h3>
      </div>
      <div className="px-4 sm:px-5 py-4 space-y-3">
        {section.fields.map((field) => (
          <CaseField
            key={field.key}
            label={field.label}
            value={data[field.key]}
          />
        ))}
      </div>
    </div>
  );
};

const METRIC_LABELS = {
  precision_diagnostica: "Precisión diagnóstica",
  claridad_textual: "Claridad textual",
  relevancia_clinica: "Relevancia clínica",
  adecuacion_contextual: "Adecuación contextual",
  nivel_tecnico: "Nivel técnico",
};

const ReviewSummary = ({ review }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden lg:sticky lg:top-0">
    <div className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
      <DynamicIcon name="ClipboardList" size={14} className="text-teal-600" />
      <h3 className="text-xs font-semibold text-gray-800">
        Valoración registrada
      </h3>
    </div>
    <div className="px-4 sm:px-5 py-4 space-y-3">
      {Object.entries(METRIC_LABELS).map(([key, label]) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-semibold text-teal-700">
              {review[key]}/5
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${(review[key] / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {review.mensaje && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
            Comentario
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {review.mensaje}
          </p>
        </div>
      )}
    </div>
  </div>
);

const CaseModal = ({ review, onClose }) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!review) return;
    setLoading(true);
    datasetService
      .getCaseById(review.id_caso)
      .then(({ data }) => setCaseData(data))
      .catch((err) => console.error("Error cargando caso:", err))
      .finally(() => setLoading(false));
  }, [review]);

  return (
    <Dialog open={!!review} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Contenedor centrado */}
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <DialogPanel className="w-full max-w-4xl max-h-[95dvh] sm:max-h-[90dvh] bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-100 shrink-0">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-sm font-semibold text-gray-800">
                Detalle de valoración
              </DialogTitle>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                Caso #{review?.id_caso} · {review?.fecha}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0 ml-2"
            >
              <DynamicIcon name="X" size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Columna izquierda: caso clínico */}
                <div className="space-y-4 lg:col-span-3 order-2 lg:order-1">
                  {caseData &&
                    CASE_SECTIONS.map((section) => (
                      <CaseSection
                        key={section.id}
                        section={section}
                        data={caseData}
                      />
                    ))}
                </div>
                {/* Columna derecha: métricas de la valoración */}
                <div className="space-y-4 order-1 lg:order-2">
                  {review && <ReviewSummary review={review} />}
                </div>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CaseModal;
