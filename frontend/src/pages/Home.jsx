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
        setMaxRegisters(response.data.cantidad_casos);
        loadCase();
      } catch (err) {
        console.error("Error loading max registers:", err);
        setError("Error al cargar los datos del dataset");
      }
    };
    if (!loading && user) {
      loadMaxRegisters();
    }
  }, [loading, user]);

  const loadCase = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const response = await datasetService.getCase();
      setCurrentCase(response.data);
      setCaseNumber(response.data.id);
      console.log(response);
    } catch (err) {
      console.error("Error loading case:", err);
      setError("Error al cargar los datos del dataset");
    } finally {
      setDataLoading(false);
    }
  };

  //  const handleLoadRandomCase = () => {
  //    const randomNum = Math.floor(Math.random() * maxRegisters);
  //    loadCase(randomNum);
  //  };

  // Callback que el compañero puede llamar desde su formulario
  const handleReviewSubmitted = () => {
    loadCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
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
              Análisis seguro impulsado por IA para diagnóstico diferencial,
              interacciones farmacológicas y síntesis de historias clínicas.
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
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Caso Clínico
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Caso {caseNumber + 1} de {maxRegisters} •{" "}
                        {currentCase.split}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Case Content */}
                <div className="px-8 py-8">
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                    {Object.entries(currentCase).map(
                      ([key, value]) =>
                        key !== "split" && (
                          <div
                            key={key}
                            className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                          >
                            <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-2">
                              {key.replace(/_/g, " ")}
                            </h3>
                            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value, null, 2)}
                            </p>
                          </div>
                        ),
                    )}
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
