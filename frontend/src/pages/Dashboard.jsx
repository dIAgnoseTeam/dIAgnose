import React, { useEffect, useMemo, useState } from "react";
import { userService, reviewService } from "../services/api";
import DashboardTable from "../components/ui/DashboardTable";
import FiltersSection from "../components/ui/FiltersSection";
import StatsSection from "../components/ui/StatsSection";
import { useFeatureFlags } from "../contexts/FeatureFlagContext";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterScore, setFilterScore] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const {
    chatEnabled,
    updateChatEnabled,
    loading: flagsLoading,
    error: flagsError,
  } = useFeatureFlags();
  const [saving, setSaving] = useState(false);

  // Mapear todos los usuarios en un objeto 'id: email' para acceder rápido desde cada review
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => (map[u.id] = u.correo));
    return map;
  }, [users]);

  // Filtrado acumulativo, cada filtro solo se aplica si tiene valor
  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const email = userMap[review.id_usuario] || "";

        return (
          (!filterUser || email.includes(filterUser.toLowerCase())) &&
          (!filterDate || review.fecha >= filterDate) &&
          (!filterScore || review.puntuacion >= filterScore)
        );
      }),
    [reviews, userMap, filterUser, filterDate, filterScore],
  );

  // Para alternar el toggle del chat
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

  // Obtener todas las valoraciones
  const getAllReviews = async () => {
    setDataLoading(true);

    try {
      const { data } = await reviewService.getAllReviews();
      setReviews(data.data);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Obtener todos los usuarios
  const getAllUsers = async () => {
    setDataLoading(true);

    try {
      const { data } = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching cases data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllReviews();
      await getAllUsers();
    };
    fetchData();
  }, []);

  if (dataLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Ajustes de aplicacion
            </h2>
            <p className="text-xs text-gray-500">Controla funciones globales</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium ${
                chatEnabled ? "text-teal-700" : "text-gray-500"
              }`}
            >
              {chatEnabled ? "Chat activo" : "Chat desactivado"}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={chatEnabled}
              aria-label="Habilitar chat"
              disabled={flagsLoading || saving}
              onClick={handleToggleChat}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                chatEnabled ? "bg-teal-600" : "bg-gray-200"
              } ${flagsLoading || saving ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  chatEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {flagsError && (
          <p className="mt-2 text-xs text-red-500">{flagsError}</p>
        )}
      </section>
      <StatsSection reviews={filteredReviews}></StatsSection>
      <FiltersSection
        setFilterUser={setFilterUser}
        setFilterDate={setFilterDate}
        setFilterScore={setFilterScore}
      ></FiltersSection>
      <DashboardTable
        reviews={filteredReviews}
        userMap={userMap}
      ></DashboardTable>
    </div>
  );
};

export default Dashboard;
