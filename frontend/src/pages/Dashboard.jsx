import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/api';
import DashboardTable from "../components/ui/DashboardTable";
import FiltersSection from '../components/ui/FiltersSection';

const Dashboard = () => {
  const [reviews, setReview] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Obtener todas las valoraciones
  const getAllReviews = async () => {
    setDataLoading(true);

    try {
      const { data } = await reviewService.getAllReviews();
      setReview(data.data);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      await getAllReviews();
    }
    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <FiltersSection></FiltersSection>
      <DashboardTable reviews={reviews} dataLoading={dataLoading}></DashboardTable>
    </div>
  )
}

export default Dashboard;