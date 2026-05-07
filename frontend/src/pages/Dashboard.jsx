import React, { useEffect, useMemo, useState } from "react";
import { userService, reviewService } from "../services/api";
import DashboardTable from "../components/ui/DashboardTable";
import FiltersSection from "../components/ui/FiltersSection";
import StatsSection from "../components/ui/StatsSection";
import AppSettings from "../components/ui/AppSettings";
import CaseModal from "../components/ui/CaseModal";
import { useDebounce } from "../hooks/useDebounce";
import { datasetService } from "../services/api";
const Dashboard = () => {
  // Datos principales
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    media: 0,
    minima: 0,
    mas_reciente: null,
  });
  // Filtros
  const [filterUserInput, setFilterUserInput] = useState("");
  const filterUser = useDebounce(filterUserInput, 500);
  const [filterDate, setFilterDate] = useState("");
  const [filterScore, setFilterScore] = useState(0);
  // Carga general de datos
  const [dataLoading, setDataLoading] = useState(false);
  // Para el modal de caso clínico
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseLoading, setCaseLoading] = useState(false);
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalReviews, setTotalReviews] = useState(0);

  // Mapear todos los usuarios en un objeto 'id: email' para acceder rápido desde cada review
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => (map[u.id] = u.correo));
    return map;
  }, [users]);

  // Obtener todas las valoraciones
  useEffect(() => {
    const fetchReviews = async () => {
      setDataLoading(true);
      try {
        const { data } = await reviewService.getAllReviews({
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          ...(filterUser && { email: filterUser }),
          ...(filterDate && { fecha: filterDate }),
          ...(filterScore && { score: filterScore }),
        });
        setReviews(data.data);
        setTotalReviews(data.count);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchReviews();
  }, [currentPage, pageSize, filterUser, filterDate, filterScore]);

  // Fetch unbico para obtener los usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch unbico para obtener las estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await reviewService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Resetear página al filtrar
  useEffect(() => setCurrentPage(1), [filterUser, filterDate, filterScore]);

  const handleFilterDate = (v) => {
    setCurrentPage(1);
    setFilterDate(v);
  };
  const handleFilterScore = (v) => {
    setCurrentPage(1);
    setFilterScore(v);
  };

  const handleViewCase = async (review) => {
    setSelectedReview(review);
    setCaseLoading(true);
    try {
      const { data } = await datasetService.getCaseById(review.id_caso);
      setSelectedCase(data);
    } catch (err) {
      console.error("Error cargando caso:", err);
    } finally {
      setCaseLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setSelectedCase(null);
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <StatsSection stats={stats}></StatsSection>
      <FiltersSection
        setFilterUser={setFilterUserInput}
        setFilterDate={handleFilterDate}
        setFilterScore={handleFilterScore}
        filterUser={filterUserInput}
        filterDate={filterDate}
        filterScore={filterScore}
      ></FiltersSection>
      <DashboardTable
        reviews={reviews}
        userMap={userMap}
        onViewCase={handleViewCase}
        currentPage={currentPage}
        pageSize={pageSize}
        totalReviews={totalReviews}
        onPageChange={setCurrentPage}
        pageLoading={dataLoading}
      ></DashboardTable>
      {selectedReview && (
        <CaseModal
          open={!!selectedReview}
          onClose={handleCloseModal}
          caseData={caseLoading ? null : selectedCase}
          review={selectedReview}
          title="Detalle de valoración"
          subtitle={
            selectedReview
              ? `Caso #${selectedReview.id_caso} · ${selectedReview.fecha}`
              : ""
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
