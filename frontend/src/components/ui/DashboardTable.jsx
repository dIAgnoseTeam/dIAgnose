import { DynamicIcon } from "./DynamicIcon";

const METRICS = [
  { key: "precision_diagnostica", label: "Precisión", color: "bg-teal-500" },
  { key: "claridad_textual", label: "Claridad", color: "bg-blue-400" },
  { key: "relevancia_clinica", label: "Relevancia", color: "bg-violet-400" },
  { key: "adecuacion_contextual", label: "Adecuación", color: "bg-amber-400" },
  { key: "nivel_tecnico", label: "Técnico", color: "bg-rose-400" },
];

const ScoreBadge = ({ value }) => {
  const color =
    value >= 4
      ? "bg-teal-50 text-teal-700"
      : value === 3
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-600";
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${color}`}
    >
      {value}
    </span>
  );
};

const MetricBar = ({ label, value, color }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 w-3 shrink-0">
      {value}
    </span>
  </div>
);

// Componente de tarjeta para vista mobile
const ReviewCard = ({ review, userMap, onViewCase }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
    {/* Header con medico y fecha */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
          <span className="text-teal-600 font-semibold text-xs">
            {userMap[review.id_usuario]?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 font-medium text-sm truncate max-w-[150px]">
          {userMap[review.id_usuario]}
        </span>
      </div>
      <ScoreBadge value={review.puntuacion} />
    </div>

    {/* Fecha */}
    <p className="text-xs text-gray-400 mb-3">{review.fecha}</p>

    {/* Metricas */}
    <div className="space-y-1.5 mb-3">
      {METRICS.map(({ key, label, color }) => (
        <MetricBar key={key} label={label} value={review[key]} color={color} />
      ))}
    </div>

    {/* Comentario */}
    {review.mensaje && (
      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
        {review.mensaje}
      </p>
    )}

    {/* Boton ver caso */}
    <button
      onClick={() => onViewCase(review)}
      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
    >
      <DynamicIcon name="Eye" size={13} />
      Ver caso
    </button>
  </div>
);

const DashboardTable = ({ reviews, userMap, onViewCase }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-6 py-16 text-center">
        <DynamicIcon
          name="ClipboardList"
          size={32}
          className="text-gray-300 mx-auto mb-3"
        />
        <p className="text-sm text-gray-400">
          No hay valoraciones que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista mobile: tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            userMap={userMap}
            onViewCase={onViewCase}
          />
        ))}
      </div>

      {/* Vista desktop: tabla */}
      <div className="hidden lg:block bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  M&eacute;dico
                </th>
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Fecha
                </th>
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Global
                </th>
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  M&eacute;tricas
                </th>
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Comentario
                </th>
                <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Caso
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Medico */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <span className="text-teal-600 font-semibold text-xs">
                          {userMap[review.id_usuario]?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium text-xs">
                        {userMap[review.id_usuario]}
                      </span>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {review.fecha}
                  </td>

                  {/* Puntuacion global */}
                  <td className="px-6 py-4">
                    <ScoreBadge value={review.puntuacion} />
                  </td>

                  {/* Metricas */}
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 min-w-[180px]">
                      {METRICS.map(({ key, label, color }) => (
                        <MetricBar
                          key={key}
                          label={label}
                          value={review[key]}
                          color={color}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Comentario */}
                  <td className="px-6 py-4 max-w-[200px]">
                    {review.mensaje ? (
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                        {review.mensaje}
                      </p>
                    ) : (
                      <span className="text-gray-300 text-xs italic">
                        Sin comentario
                      </span>
                    )}
                  </td>

                  {/* Ver caso */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewCase(review)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                    >
                      <DynamicIcon name="Eye" size={13} />
                      Ver caso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardTable;
