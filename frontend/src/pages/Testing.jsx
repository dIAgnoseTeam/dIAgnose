import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import RegisterCard from "../components/ui/RegisterCard";
import { API_BASE } from "../config/constants";

function Testing() {
  const [greeting, setGreeting] = useState("");
  const [num, setNum] = useState(0);
  const [maxRegisters, setMaxRegisters] = useState(0);
  const [record, setRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [errorRecord, setErrorRecord] = useState(null);

  // Fetch del saludo inicial
  useEffect(() => {
    fetch(`${API_BASE}/health/hello`)
      .then((r) => r.json())
      .then((data) => setGreeting(data.message))
      .catch((err) => console.error("Error saludo:", err));
  }, []);

  const fetchRecord = useCallback(
    (n) => {
      setLoadingRecord(true);
      setErrorRecord(null);
      const controller = new AbortController();
      const id = n ?? num;

      fetch(`${API_BASE}/dataset/registro/${id}`, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((response) => {
          // El backend ahora retorna {success: true, data: {...}, message: "..."}
          if (response.success && response.data) {
            setRecord(response.data);
          } else {
            throw new Error(response.message || "Error al obtener registro");
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setErrorRecord(err.message);
            setRecord(null);
          }
        })
        .finally(() => setLoadingRecord(false));

      return () => controller.abort();
    },
    [num]
  );

  useEffect(() => {
    fetch(`${API_BASE}/dataset/registro/max-registers`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setMaxRegisters(data.data || 99);
      })
      .catch((err) => {
        console.error("Error obteniendo max registros:", err);
        setMaxRegisters(99); // Fallback por defecto
      });
  }, []);

  // Auto-cargar registro inicial
  useEffect(() => {
    const cleanup = fetchRecord(num);
    return cleanup;
  }, [fetchRecord, num]);

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
            disabled={loadingRecord || num <= 0}
          >
            <ArrowLeft color="white" strokeWidth={3} />
          </button>
          <span className="p-4 bg-secondary-50 rounded-xl text-xl font-bold ">
            {num + 1} / {maxRegisters + 1}
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
