import { FileText, Plus, Search, Edit, Trash2 } from "lucide-react";

const CasesManagement = () => {
  // TODO: Implementar logica de CRUD para casos clinicos
  // - useState para lista de casos
  // - useEffect para cargar casos desde API
  // - Funciones: createCase, updateCase, deleteCase

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Casos cl&iacute;nicos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los casos cl&iacute;nicos del sistema
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
          <Plus size={16} />
          Nuevo caso
        </button>
      </div>

      {/* Barra de busqueda */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar casos por ID, diagn&oacute;stico..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Placeholder para tabla de casos */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-600">Lista de casos</p>
        </div>

        {/* Estado vacio - reemplazar con tabla real */}
        <div className="px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-2">
            Implementa aqu&iacute; el CRUD de casos cl&iacute;nicos
          </p>
          <p className="text-gray-400 text-xs">
            Utiliza datasetService para las operaciones de API
          </p>
        </div>

        {/* Ejemplo de estructura de fila (comentado)
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Diagnostico</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dificultad</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">#001</td>
              <td className="px-6 py-4 text-sm text-gray-700">Diabetes tipo 2</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Media</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        */}
      </div>
    </div>
  );
};

export default CasesManagement;
