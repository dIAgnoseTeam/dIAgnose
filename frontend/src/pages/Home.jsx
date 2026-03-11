import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { datasetService } from "../services/api";
import { CaseProvider } from "../contexts/CaseContext";

const Home = () => {
  const { user, loading } = useAuth();
  const [currentCase, setCurrentCase] = useState(null);
  const [caseNumber, setCaseNumber] = useState(0);
  const [maxRegisters, setMaxRegisters] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el máximo de registros al montar el componente
  useEffect(() => {
    const loadMaxRegisters = async () => {
      try {
        const response = await datasetService.getMaxRegisters();
        setMaxRegisters(response.data.data);
        // Cargar un caso aleatorio automáticamente
        const randomNum = Math.floor(Math.random() * response.data.data);
        loadCase(randomNum);
      } catch (err) {
        console.error("Error loading max registers:", err);
        setError("Error al cargar los datos del dataset");
      }
    };
    if (!loading && user) {
      loadMaxRegisters();
    }
  }, [loading, user]);

  const loadCase = async (num) => {
    setDataLoading(true);
    setError(null);
    try {
      const response = await datasetService.getCase(num);
      setCurrentCase(response.data.data);
      setCaseNumber(num);
    } catch (err) {
      console.error("Error loading case:", err);
      setError("Error al cargar los datos del dataset");
    } finally {
      setDataLoading(false);
    }
  };

  const handleLoadRandomCase = () => {
    const randomNum = Math.floor(Math.random() * maxRegisters);
    loadCase(randomNum);
  };

  // Callback que el compañero puede llamar desde su formulario
  const handleReviewSubmitted = () => {
    // Cargar un nuevo caso aleatorio
    const randomNum = Math.floor(Math.random() * maxRegisters);
    loadCase(randomNum);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  // Datos disponibles para el compañero a través del Context
  const caseContextValue = {
    caseNumber,
    currentCase,
    onReviewSubmitted: handleReviewSubmitted,
  };

  return (
    <CaseProvider value={caseContextValue}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Diagnóstico Clínico & Análisis
            </h1>
            <p className="text-lg text-gray-500">
              Análisis seguro impulsado por IA para diagnóstico diferencial, interacciones farmacológicas y síntesis de historias clínicas.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Case Display Area */}
          {dataLoading ? (
            <div className="flex justify-center items-center py-24">
              <p className="text-gray-500 text-lg">Cargando caso clínico...</p>
            </div>
          ) : currentCase ? (
            <div className="space-y-6">
              {/* Case Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-8 py-6 border-b border-teal-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Caso Clínico</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Caso {caseNumber + 1} de {maxRegisters} • {currentCase.split}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Case Content */}
                <div className="px-8 py-8">
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                    {Object.entries(currentCase).map(([key, value]) => (
                      key !== "split" && (
                        <div key={key} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-2">
                            {key.replace(/_/g, " ")}
                          </h3>
                          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                            {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2">
                    <span>→</span>
                    Rellenar Formulario
                  </button>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="space-y-4">
                {/* Main Navigation Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleLoadRandomCase}
                    className="bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-200 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    ← Otro caso
                  </button>
                  <div className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-semibold">
                    <span>{caseNumber + 1} / {maxRegisters}</span>
                  </div>
                </div>

                {/* Go to Specific Case */}
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max={maxRegisters}
                    defaultValue={caseNumber + 1}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const num = parseInt(e.target.value) - 1;
                        if (num >= 0 && num < maxRegisters) {
                          loadCase(num);
                        }
                      }
                    }}
                    className="flex-1 border-2 border-gray-200 focus:border-teal-500 focus:outline-none px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400"
                    placeholder="Ir al caso número..."
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector("input");
                      const num = parseInt(input.value) - 1;
                      if (num >= 0 && num < maxRegisters) {
                        loadCase(num);
                      }
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    Ir
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-500 text-lg">Sin datos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </CaseProvider>
  );
};

export default Home;