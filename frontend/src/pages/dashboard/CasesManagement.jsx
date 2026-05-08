import { useEffect, useState } from "react";
import { FileText, Plus, Search, Trash2, Eye, X, Check } from "lucide-react";
import { datasetService } from "../../services/api";
import CaseModal from "../../components/ui/CaseModal";

const DIFICULTAD_STYLES = {
  facil: "bg-green-50 text-green-700",
  media: "bg-yellow-50 text-yellow-700",
  dificil: "bg-red-50 text-red-700",
};

const DificultadBadge = ({ dificultad }) => (
  <span
    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize
    ${DIFICULTAD_STYLES[dificultad] ?? "bg-gray-100 text-gray-600"}`}
  >
    {dificultad ?? "—"}
  </span>
);

const PAGE_SIZE = 10;

const CasesManagement = () => {
  const [cases, setCases] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const { data } = await datasetService.getAllCases({
          limit: PAGE_SIZE,
          offset: (currentPage - 1) * PAGE_SIZE,
          search: search || undefined,
          dificultad: dificultad || undefined,
        });
        setCases(data.data);
        setTotal(data.count);
      } catch (err) {
        console.error("Error al cargar casos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [currentPage, search, dificultad]);

  // Resetear página al filtrar
  useEffect(() => setCurrentPage(1), [search, dificultad]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (caseId) => {
    try {
      await datasetService.deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setTotal((prev) => prev - 1);
      setDeletingId(null);
    } catch (err) {
      console.error("Error al eliminar caso:", err);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Casos clínicos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los casos clínicos del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-lg">
            <FileText size={14} className="text-teal-600" />
            <span className="text-xs font-medium text-teal-700">
              {total} casos
            </span>
          </div>
        </div>
      </div>
      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por diagnóstico, motivo o categoría..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600
                         placeholder:text-gray-400"
            />
          </div>
          <select
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700
                       focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Todas las dificultades</option>
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
      </div>
      {/* Tabla */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Diagnóstico
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Categoría
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Dificultad
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Paciente
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <FileText size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    No se encontraron casos
                  </p>
                </td>
              </tr>
            ) : (
              cases.map((caso) => (
                <tr
                  key={caso.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    #{caso.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700 line-clamp-1 max-w-xs">
                      {caso.diagnostico_final ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                      {caso.motivo}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[160px] line-clamp-1">
                    {caso.categoria ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <DificultadBadge dificultad={caso.dificultad} />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {caso.edad} años · {caso.sexo}
                  </td>
                  <td className="px-6 py-4">
                    {deletingId === caso.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          ¿Eliminar?
                        </span>
                        <button
                          onClick={() => handleDelete(caso.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedCase(caso)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="Ver caso"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingId(caso.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Eliminar caso"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, total)} de {total} casos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-500">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      {/* CARDS — solo móvil */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No se encontraron casos</p>
          </div>
        ) : (
          cases.map((caso) => (
            <div
              key={caso.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-medium text-gray-900 text-sm line-clamp-2">
                    {caso.diagnostico_final ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {caso.motivo}
                  </p>
                </div>
                <DificultadBadge dificultad={caso.dificultad} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-400 block mb-0.5">Categoría</span>
                  {caso.categoria ?? "—"}
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Paciente</span>
                  {caso.edad} años · {caso.sexo}
                </div>
              </div>

              {deletingId === caso.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 flex-1">
                    ¿Eliminar este caso?
                  </span>
                  <button
                    onClick={() => handleDelete(caso.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCase(caso)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
                  >
                    <Eye size={13} /> Ver caso
                  </button>
                  <button
                    onClick={() => setDeletingId(caso.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {/* Paginación móvil */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-xs text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      <CaseModal
        open={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        caseData={selectedCase}
        title="Detalle del caso"
        subtitle={
          selectedCase
            ? `Caso #${selectedCase.id} · ${selectedCase.categoria ?? ""}`
            : ""
        }
      />
    </div>
  );
};

export default CasesManagement;
