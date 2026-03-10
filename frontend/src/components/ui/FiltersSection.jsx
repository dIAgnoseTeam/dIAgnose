import React from "react";

const FiltersSection = () => {
  return (
    <section className="flex flex-col sm:flex-row justify-end gap-2 mb-6">
            <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium">Email del usuario</label>
                <input type="email" className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-700" placeholder="medico@gmail.com"/>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium ">Fecha</label>
                <input type="date" className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"/>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium ">Puntuación</label>
                <select className="text-gray-700 text-sm bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600">
                    <option value="" selected disabled>Todas las puntuaciones</option>
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