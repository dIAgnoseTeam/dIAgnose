import { CASE_SECTIONS } from "../../config/caseConfig";
import { DynamicIcon } from "./DynamicIcon";

const CaseField = ({ label, value }) => {
  if (!value && value !== 0) return null; // omite campos vacíos

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
  // No renderiza la sección si ningún campo tiene valor
  const hasContent = section.fields.some(
    (f) => data[f.key] != null && data[f.key] !== "",
  );
  if (!hasContent) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 sm:px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
        <DynamicIcon name={section.icon} size={16} className="text-teal-600" />
        <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
      </div>
      <div className="px-4 sm:px-6 py-5 space-y-4">
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

const CaseViewer = ({ caseData, caseNumber, maxRegisters }) => (
  <div className="flex-1 space-y-4">
    {/* Cabecera */}
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 sm:px-8 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Caso Clínico
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Caso {caseNumber + 1} de {maxRegisters}
        {caseData.dificultad && (
          <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
            {caseData.dificultad}
          </span>
        )}
      </p>
    </div>

    {/* Secciones */}
    {CASE_SECTIONS.map((section) => (
      <CaseSection key={section.id} section={section} data={caseData} />
    ))}
  </div>
);

export default CaseViewer;
