import React from "react";

const DashboardTable = (props) => {
    const { reviews, userMap } = props;

    return (
        <div className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 font-semibold text-gray-500">Médico</th>
                        <th className="px-6 py-3 font-semibold text-gray-500">Fecha</th>
                        <th className="px-6 py-3 font-semibold text-gray-500">Puntuación</th>
                        <th className="px-6 py-3 font-semibold text-gray-500">Comentario</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {reviews.map(review => (
                        <tr key={review.id} className="hover:bg-gray-50 transition-colors duration-100">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-600 font-semibold text-xs">
                                            {userMap[review.id_usuario]?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{userMap[review.id_usuario]}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-gray-500">{review.fecha}</td>
                            <td className="px-6 py-3 text-gray-700">{review.puntuacion}</td>
                            <td className="px-6 py-3 text-gray-500">{review.mensaje}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardTable;