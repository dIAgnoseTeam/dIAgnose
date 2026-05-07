import { useEffect, useState } from "react";
import { settingsService } from "../../services/api";
import {
  Users,
  FileText,
  Star,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Tarjeta de métrica
const MetricCard = ({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
  <article className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}
      >
        <Icon size={16} className={iconColor} />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </article>
);

// Barra de distribución de puntuaciones
const ScoreBar = ({ score, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    1: "bg-red-400",
    2: "bg-orange-400",
    3: "bg-yellow-400",
    4: "bg-teal-400",
    5: "bg-green-500",
  };
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-4 shrink-0">{score}★</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[score] || "bg-teal-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right shrink-0">
        {count}
      </span>
    </div>
  );
};

// Componente principal
const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await settingsService.getDashboard();
      setStats(data);
    } catch (err) {
      setError("No se pudieron cargar las estadísticas del sistema.");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && initialLoad) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin h-7 w-7 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 py-4">
        <AlertCircle size={16} />
        {error}
      </div>
    );
  }

  const distribucion = stats?.valoraciones?.distribucion ?? {};
  const totalValoraciones = stats?.valoraciones?.total ?? 0;

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Estadísticas globales
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Resumen de actividad de la plataforma
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          title="Actualizar estadísticas"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {/* Grid de métricas */}
      <div className="p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Usuarios registrados"
          value={stats?.usuarios?.total}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <MetricCard
          icon={FileText}
          label="Casos clínicos"
          value={stats?.casos_clinicos?.total}
          sub={`${stats?.casos_clinicos?.sin_valorar ?? 0} sin valorar · ${stats?.casos_clinicos?.con_valoracion_completa ?? 0} completos`}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <MetricCard
          icon={Star}
          label="Total valoraciones"
          value={totalValoraciones}
          sub={`Media: ${stats?.valoraciones?.media_puntuacion ?? "—"} / 5`}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <MetricCard
          icon={MessageSquare}
          label="Chats"
          value={stats?.chats?.total}
          sub={`${stats?.chats?.activos ?? 0} activos`}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
        />
      </div>

      {/* Distribución de puntuaciones */}
      {totalValoraciones > 0 && (
        <>
          <div className="border-t border-gray-100 mx-4 sm:mx-6" />
          <div className="px-4 sm:px-6 py-4">
            <p className="text-xs font-medium text-gray-500 mb-3">
              Distribución de puntuaciones
            </p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((score) => (
                <ScoreBar
                  key={score}
                  score={score}
                  count={distribucion[String(score)] ?? 0}
                  total={totalValoraciones}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default DashboardStats;
