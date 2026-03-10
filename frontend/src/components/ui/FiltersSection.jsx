import React from "react";

const FiltersSection = (props) => {
    const { setFilterUser, setFilterDate, setFilterScore } = props;

    return (
        <section className="flex flex-col sm:flex-row justify-end gap-2 mb-6">
                <div className="flex flex-col gap-1">
                    <label className="text-gray-600 text-xs font-medium" htmlFor="filter-email">Email del usuario</label>
                    <input type="email" id="filter-email" className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-700" placeholder="medico@gmail.com" onChange={(e) => setFilterUser(e.target.value.trim())}/>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="filter-date" className="text-gray-600 text-xs font-medium ">Fecha</label>
                    <input type="date" id="filter-date" className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600" onChange={(e) => setFilterDate(e.target.value.trim())}/>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="filter-score" className="text-gray-600 text-xs font-medium ">Puntuación</label>
                    <select id="filter-score" className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600" onChange={(e) => setFilterScore(e.target.value.trim())}>
                        <option value="">Todas las puntuaciones</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </div>
        </section>
    )
}

export default FiltersSection