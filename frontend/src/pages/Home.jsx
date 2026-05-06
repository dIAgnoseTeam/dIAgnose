import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { datasetService } from "../services/api";
import { CaseProvider } from "../contexts/CaseContext";
import { useNavigate } from "react-router";
import CaseForm from "../components/ui/CaseForm";
import CaseViewer from "../components/ui/CaseViewer";

const Home = () => {
  const { user, loading } = useAuth();
  const [currentCase, setCurrentCase] = useState(null);
  const [caseNumber, setCaseNumber] = useState(0);
  const [maxRegisters, setMaxRegisters] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center h-dvh">
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
      <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Diagnóstico Clínico & Análisis
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 px-4">
              Análisis seguro impulsado por IA para diagnóstico diferencial,
              interacciones farmacológicas y síntesis de historias clínicas.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Case Display Area */}
          {dataLoading ? (
            <div className="flex justify-center items-center py-24">
              <p className="text-gray-500 text-lg">Cargando caso clínico...</p>
            </div>
          ) : currentCase ? (
            <div className="flex flex-col xl:flex-row items-start gap-6">
              {/* Case Content Card */}
              <div className="w-full xl:flex-1 min-w-0">
                <CaseViewer
                  caseData={currentCase}
                  caseNumber={caseNumber}
                  maxRegisters={maxRegisters}
                />
              </div>
              <div className="w-full xl:w-[420px] xl:shrink-0 xl:sticky xl:top-0 xl:self-start xl:max-h-[calc(100dvh-5rem)]">
                <CaseForm idCase={caseNumber} />
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
