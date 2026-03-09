import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { PropagateLoader } from 'react-spinners';
import { reviewService } from '../services/api';
import DashboardTable from "../components/ui/DashboardTable";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReview] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Obtener todas las valoraciones
  const getAllReviews = async () => {
    setDataLoading(true);

    try {
      const { data } = await reviewService.getAllReviews();
      setReview(data.data);
      console.log(data);
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

  useEffect(() => {
    if(!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if(loading) {
    return (
      <div className="h-dvh w-dvh flex items-center justify-center">
        <PropagateLoader color="#1e3a8a" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardTable reviews={reviews}></DashboardTable>
    </div>
  )
}

export default Dashboard;