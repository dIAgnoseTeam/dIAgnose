import React from "react";

const StatCard = (props) => {
    const { title, value, icon } = props;

    return (
        <article className="min-h-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-end mb-4">
                {icon}
            </div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl text-gray-800 font-semibold">{value}</p>
        </article>
    )
}

export default StatCard;