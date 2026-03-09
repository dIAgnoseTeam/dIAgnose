import React from 'react';

const DashboardTable = (props) => {
    const { reviews } = props;

    return (
        <div className="overflow-hidden bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Médico</th>
                        <th className="px-4 py-3 font-semibold">Fecha </th>
                        <th className="px-4 py-3 font-semibold">Puntuación</th>
                        <th className="px-4 py-3 font-semibold">Comentario</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map(review => (
                        <tr key={review.id} className="text-gray-600 hover:bg-gray-100 transition-colors">
                            <td className="px-4 py-3">{review.id_usuario}</td>
                            <td className="px-4 py-3">{review.fecha_creacion}</td>
                            <td className="px-4 py-3">{review.puntuacion}</td>
                            <td className="px-4 py-3">{review.mensaje}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DashboardTable;