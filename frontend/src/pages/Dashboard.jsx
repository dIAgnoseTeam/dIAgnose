import React, { useEffect, useMemo, useState } from 'react';
import { userService, reviewService } from '../services/api';
import DashboardTable from "../components/ui/DashboardTable";
import FiltersSection from '../components/ui/FiltersSection';
import StatsSection from '../components/ui/StatsSection';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterScore, setFilterScore] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);

  // Mapear todos los usuarios en un objeto 'id: email' para acceder rápido desde cada review
  const userMap = useMemo(() => {
    const map = {};
    users.forEach(u => map[u.id] = u.correo);
    return map;
  }, [users]);

  // Filtrado acumulativo, cada filtro solo se aplica si tiene valor 
  const filteredReviews = useMemo(() => reviews.filter(review => {
    const email = userMap[review.id_usuario] || "";

    return (
      (!filterUser || email.includes(filterUser.toLowerCase())) &&
      (!filterDate || review.fecha >= filterDate) &&
      (!filterScore || review.puntuacion >= filterScore)
    );
  }), [reviews, userMap, filterUser, filterDate, filterScore]);

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
  }

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
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllReviews();
      await getAllUsers();
    }
    fetchData();
  }, []);

  if(dataLoading) {
      return (
        <div className="flex justify-center p-10">
            <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full"></div>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StatsSection reviews={filteredReviews}></StatsSection>
      <FiltersSection setFilterUser={setFilterUser} setFilterDate={setFilterDate} setFilterScore={setFilterScore}></FiltersSection>
      <DashboardTable reviews={filteredReviews} userMap={userMap}></DashboardTable>
    </div>
  )
}

export default Dashboard;