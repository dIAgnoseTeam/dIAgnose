import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import RegisterCard from "../components/ui/RegisterCard";
import { API_BASE } from "../config/constants";
import api from "../services/api";

function Testing() {
  const [num, setNum] = useState(1); // Empezar en 1
  const [maxRegisters, setMaxRegisters] = useState(0);
  const [record, setRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [errorRecord, setErrorRecord] = useState(null);

  // Fetch del saludo inicial
  useEffect(() => {
    fetch(`${API_BASE}/health/hello`)
      .then((r) => r.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error("Error saludo:", err));
  }, []);

  const fetchRecord = useCallback(
    async (n) => {
      setLoadingRecord(true);
      setErrorRecord(null);
      const id = n ?? num;

      try {
        const response = await api.get(`/cases/${id}`);
        setRecord(response.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Error al obtener registro";
        setErrorRecord(errorMsg);
        setRecord(null);
      } finally {
        setLoadingRecord(false);
      }
    },
    [], // Sin dependencias para evitar recrear la función
  );

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await api.get("/cases/count");
        setMaxRegisters(response.data.cantidad_casos);
      } catch (err) {
        console.error("Error obteniendo max registros:", err);
        setMaxRegisters(99);
      }
    };
    fetchCount();
  }, []);

  // Auto-cargar registro cuando cambia el num
  useEffect(() => {
    fetchRecord(num);
  }, [num, fetchRecord]);

  const safeField = (value, fallback = "No disponible") =>
    value ? value : fallback;

  return (
    <div className="p-4 min-h-max m-0">
      <div className="flex flex-col gap-2 items-center">
        <p className="text-center text-2xl font-bold text-primary-800">
          Visualizador de registros
        </p>
        <div className="flex gap-4 my-4">
          <button
            className="p-4 bg-secondary-800 rounded-xl hover:bg-secondary-900"
            onClick={() => setNum(num - 1)}
            disabled={loadingRecord || num <= 1}
          >
            <ArrowLeft color="white" strokeWidth={3} />
          </button>
          <span className="p-4 bg-secondary-50 rounded-xl text-xl font-bold ">
            {num} / {maxRegisters}
          </span>
          <button
            className="p-4 bg-secondary-800 rounded-xl hover:bg-secondary-900"
            onClick={() => setNum(num + 1)}
            disabled={loadingRecord || num >= maxRegisters}
          >
            <ArrowRight color="white" strokeWidth={3} />
          </button>
        </div>

        {loadingRecord && (
          <div className="flex justify-center items-center py-8">
            <PropagateLoader color="#1e3a8a" />
          </div>
        )}

        {errorRecord && (
          <div className="">
            <p className="">Error</p>
            <p className="">{errorRecord}</p>
          </div>
        )}

        {record && !loadingRecord && (
          <div className="flex flex-wrap gap-4">
            {Object.entries(record).map(([key, value]) => (
              <div key={key} className="flex-1 min-w-[280px] max-w-[400px]">
                <RegisterCard
                  title={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  content={safeField(value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Testing;
