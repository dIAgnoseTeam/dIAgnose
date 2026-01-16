import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";
import Navbar from "../components/ui/Navbar";

const Home = () => {
  const { user, loading } = useAuth();
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido, {user?.name || user?.email}
          </h1>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Panel de Control</h2>

            {dataLoading ? (
              <p>Cargando datos...</p>
            ) : protectedData ? (
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(protectedData, null, 2)}
              </pre>
            ) : (
              <button
                onClick={fetchProtectedData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Cargar Datos
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
