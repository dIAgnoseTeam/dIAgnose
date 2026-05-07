import { useState } from "react";
import { useFeatureFlags } from "../../contexts/FeatureFlagContext";
import {
  BotMessageSquare,
  ClipboardCheck,
  Settings2,
  ShieldAlert,
  UserPlus,
  Hash,
  CheckCircle2,
} from "lucide-react";


const Toggle = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${checked ? "bg-teal-600" : "bg-gray-200"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
        ${checked ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);


const SettingRow = ({ icon, label, description, badge, control, last }) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-700">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-tight">{label}</p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 ml-11 sm:ml-4 shrink-0">
        {badge}
        {control}
      </div>
    </div>
    {!last && <div className="border-t border-gray-100" />}
  </>
);


const SectionHeader = ({ icon, title, subtitle }) => (
  <>
    <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4">
      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{title}</p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="border-t border-gray-100" />
  </>
);

// Badge de estado
const StatusBadge = ({ active, activeLabel = "Activo", inactiveLabel = "Inactivo" }) => (
  <span
    className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors ${active ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-400"
      }`}
  >
    {active ? activeLabel : inactiveLabel}
  </span>
);


const AppSettings = () => {
  const {
    chatEnabled,
    reviewsEnabled,
    maintenanceMode,
    maxReviewsPerCase,
    updateChatEnabled,
    updateSetting,
    loading: flagsLoading,
    error: flagsError,
  } = useFeatureFlags();

  const [saving, setSaving] = useState(null); // guarda qué campo se está guardando
  const [maxReviewsInput, setMaxReviewsInput] = useState(String(maxReviewsPerCase));
  const [savedMaxReviews, setSavedMaxReviews] = useState(false);

  const handleToggle = async (field, currentValue) => {
    if (flagsLoading || saving) return;
    setSaving(field);
    try {
      if (field === "chat_enabled") {
        await updateChatEnabled(!currentValue);
      } else {
        await updateSetting({ [field]: !currentValue });
      }
    } catch (err) {
      console.error(`Error actualizando ${field}:`, err);
    } finally {
      setSaving(null);
    }
  };

  const handleSaveMaxReviews = async () => {
    const value = parseInt(maxReviewsInput, 10);
    if (isNaN(value) || value < 1 || value > 20) return;
    if (saving) return;
    setSaving("max_reviews_per_case");
    try {
      await updateSetting({ max_reviews_per_case: value });
      setSavedMaxReviews(true);
      setTimeout(() => setSavedMaxReviews(false), 2000);
    } catch (err) {
      console.error("Error actualizando max_reviews_per_case:", err);
    } finally {
      setSaving(null);
    }
  };

  const isDisabled = (field) => flagsLoading || saving === field;

  return (
    <div className="space-y-6">

      {/* ── Sección 1: Funcionalidades ── */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
        <SectionHeader
          icon={<Settings2 size={18} />}
          title="Funcionalidades"
          subtitle="Activa o desactiva las características principales del sistema"
        />
        <div className="px-4 sm:px-6 py-1">
          <SettingRow
            icon={<BotMessageSquare size={16} />}
            label="Chat con IA"
            description="Permite a los usuarios acceder al asistente de inteligencia artificial"
            badge={<StatusBadge active={chatEnabled} />}
            control={
              <Toggle
                checked={chatEnabled}
                onChange={() => handleToggle("chat_enabled", chatEnabled)}
                disabled={isDisabled("chat_enabled")}
                label="Habilitar chat con IA"
              />
            }
          />
          <SettingRow
            icon={<ClipboardCheck size={16} />}
            label="Valoraciones de casos"
            description="Permite a los usuarios enviar valoraciones sobre los casos clínicos"
            badge={<StatusBadge active={reviewsEnabled} />}
            control={
              <Toggle
                checked={reviewsEnabled}
                onChange={() => handleToggle("reviews_enabled", reviewsEnabled)}
                disabled={isDisabled("reviews_enabled")}
                label="Habilitar valoraciones"
              />
            }
            last
          />
        </div>
        {flagsError && (
          <p className="px-4 sm:px-6 pb-4 text-xs text-red-500">{flagsError}</p>
        )}
      </section>

      {/* ── Sección 2: Control de acceso ── */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
        <SectionHeader
          icon={<ShieldAlert size={18} />}
          title="Control de acceso"
          subtitle="Gestiona quién puede acceder y en qué condiciones"
        />
        <div className="px-4 sm:px-6 py-1">
          <SettingRow
            icon={<ShieldAlert size={16} />}
            label="Modo mantenimiento"
            description="Actívalo para informar a los usuarios de que el sistema está en mantenimiento"
            badge={
              <StatusBadge
                active={maintenanceMode}
                activeLabel="Activado"
                inactiveLabel="Desactivado"
              />
            }
            control={
              <Toggle
                checked={maintenanceMode}
                onChange={() => handleToggle("maintenance_mode", maintenanceMode)}
                disabled={isDisabled("maintenance_mode")}
                label="Modo mantenimiento"
              />
            }
          />
          <SettingRow
            icon={<UserPlus size={16} />}
            label="Registro de nuevos usuarios"
            description="Permite el acceso de nuevos usuarios mediante Google OAuth"
            badge={
              <StatusBadge
                active={!maintenanceMode}
                activeLabel="Permitido"
                inactiveLabel="Bloqueado"
              />
            }
            control={
              <Toggle
                checked={!maintenanceMode}
                onChange={() => handleToggle("maintenance_mode", maintenanceMode)}
                disabled={isDisabled("maintenance_mode")}
                label="Permitir nuevos usuarios"
              />
            }
            last
          />
        </div>
      </section>

      {/* ── Sección 3: Límites ── */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
        <SectionHeader
          icon={<Hash size={18} />}
          title="Límites del sistema"
          subtitle="Configura los umbrales y límites de las operaciones"
        />
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-700">
                <ClipboardCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  Valoraciones máximas por caso
                </p>
                <p className="text-xs text-gray-400 leading-tight mt-0.5">
                  Número máximo de revisiones que puede recibir cada caso clínico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-11 sm:ml-4 shrink-0">
              <input
                type="number"
                min={1}
                max={20}
                value={maxReviewsInput}
                onChange={(e) => setMaxReviewsInput(e.target.value)}
                className="w-16 text-center text-sm border border-gray-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                aria-label="Máximo de valoraciones por caso"
              />
              <button
                onClick={handleSaveMaxReviews}
                disabled={isDisabled("max_reviews_per_case")}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
                  ${savedMaxReviews
                    ? "bg-green-100 text-green-700"
                    : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
              >
                {savedMaxReviews ? (
                  <>
                    <CheckCircle2 size={13} />
                    Guardado
                  </>
                ) : saving === "max_reviews_per_case" ? (
                  "Guardando..."
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AppSettings;
