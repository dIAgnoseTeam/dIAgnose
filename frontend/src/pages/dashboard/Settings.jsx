import AppSettings from "../../components/ui/AppSettings";
import DashboardStats from "../../components/ui/DashboardStats";

const Settings = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Ajustes de aplicación
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configura las opciones globales del sistema
        </p>
      </div>

      <DashboardStats />

      <AppSettings />
    </div>
  );
};

export default Settings;
