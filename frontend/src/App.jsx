import { useEffect, useState, useCallback } from "react";

// En producción usa el proxy de nginx (/api), en dev local usa variable de entorno
const API_BASE = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [greeting, setGreeting] = useState("");
  const [num, setNum] = useState(0);
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

  // Auto-cargar registro inicial
  useEffect(() => {
    const cleanup = fetchRecord(num);
    return cleanup;
  }, [fetchRecord, num]);

  const safeField = (value, fallback = "No disponible") =>
    value ? value : fallback;

  return (
    <div className="p-4 bg-red-50 min-h-screen m-0">
      <div className="">
        <div className="">
          <h1 className="">{greeting || "Cargando..."}</h1>

          <div className="flex gap-4 my-4">
            <div className=" flex flex-col">
              <label htmlFor="num" className="">
                Número de Registro
              </label>
              <input
                type="number"
                id="num"
                className="border border-gray-300 rounded-md p-2"
                value={num}
                min={0}
                max={99}
                onChange={(e) => setNum(Number(e.target.value) || 0)}
              />
            </div>
            <div className="align-end flex items-end">
              <button
                onClick={() => fetchRecord(num)}
                disabled={loadingRecord}
                className="bg-red-400 p-2 rounded-md flex items-end"
              >
                {loadingRecord ? "Buscando..." : "Obtener Registro"}
              </button>
            </div>
          </div>

          {errorRecord && (
            <div className="">
              <p className="">Error</p>
              <p className="">{errorRecord}</p>
            </div>
          )}

          {record && (
            <div className="flex flex-col gap-4">
              {"alergias" in record && (
                <div className="bg-red-100 p-4 rounded-md">
                  <p className="font-bold">Alergias</p>
                  <p className="">{safeField(record.alergias)}</p>
                </div>
              )}
              {"habitos" in record && (
                <div className="bg-red-100 p-4 rounded-md">
                  <p className="font-bold">Hábitos</p>
                  <p className="">{safeField(record.habitos)}</p>
                </div>
              )}
              <div className="flex flex-col gap-4">
                {"factores_sociales" in record && (
                  <div className="bg-red-100 p-4 rounded-md">
                    <p className="font-bold">Factores Sociales</p>
                    <p className="">{safeField(record.factores_sociales)}</p>
                  </div>
                )}
                {"sintomas" in record && (
                  <div className="bg-red-100 p-4 rounded-md">
                    <p className="font-bold">Sintomas</p>
                    <p className="">{safeField(record.sintomas)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
