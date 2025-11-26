import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";
import Navbar from "../components/ui/Navbar";

const Home = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchProtectedData = async () => {
    setDataLoading(true);
    try {
      const response = await authService.getProtectedData();
      setProtectedData(response.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <h1>Bienvenido, {user.name} </h1>
    </>
  );
};

export default Home;
