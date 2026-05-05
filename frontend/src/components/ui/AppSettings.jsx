import { useState } from "react";
import { useFeatureFlags } from "../../contexts/FeatureFlagContext";
import { BotMessageSquare, Settings2 } from "lucide-react";

const SettingRow = ({ icon, label, description, badge, control }) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-700">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            {label}
          </p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 ml-11 sm:ml-4 shrink-0">
        {badge}
        {control}
      </div>
    </div>
    <div className="border-t border-gray-100 last:hidden" />
  </>
);

const AppSettings = () => {
  const {
    chatEnabled,
    updateChatEnabled,
    loading: flagsLoading,
    error: flagsError,
  } = useFeatureFlags();
  const [saving, setSaving] = useState(false);

  const handleToggleChat = async () => {
    if (flagsLoading || saving) return;
    setSaving(true);
    try {
      await updateChatEnabled(!chatEnabled);
    } catch (err) {
      console.error("Error actualizando chat:", err);
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = flagsLoading || saving;

  return (
    <section className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
      {/* Cabecera */}
      <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4">
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
          <Settings2 />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            Ajustes de aplicaci&oacute;n
          </p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            Controla las funciones globales del sistema
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Filas de ajustes */}
      <div className="px-4 sm:px-6 py-1">
        <SettingRow
          icon={<BotMessageSquare />}
          label="Chat con IA"
          description="Permite a los usuarios acceder al asistente de inteligencia artificial"
          badge={
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors ${
                chatEnabled
                  ? "bg-teal-50 text-teal-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {chatEnabled ? "Activo" : "Inactivo"}
            </span>
          }
          control={
            <button
              type="button"
              role="switch"
              aria-checked={chatEnabled}
              aria-label="Habilitar chat"
              disabled={isDisabled}
              onClick={handleToggleChat}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${chatEnabled ? "bg-teal-600" : "bg-gray-200"}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                ${chatEnabled ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          }
        />
      </div>

      {flagsError && (
        <p className="px-4 sm:px-6 pb-4 text-xs text-red-500">{flagsError}</p>
      )}
    </section>
  );
};

export default AppSettings;
