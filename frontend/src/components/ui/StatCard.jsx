import React from "react";
import { DynamicIcon } from "./DynamicIcon";

const StatCard = (props) => {
  const { title, value, icon, iconStyle } = props;

  return (
    <article className="min-h-20 sm:min-h-24 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-end mb-2">
        <DynamicIcon
          name={icon}
          size={36}
          className={iconStyle || "text-teal-600"}
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-xl sm:text-2xl text-gray-800 font-semibold">{value}</p>
    </article>
  );
};

export default StatCard;
