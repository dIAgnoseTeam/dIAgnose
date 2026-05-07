import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const NavItem = ({ id, icon: Icon, label, path, isActive, onClick }) => (
  <Link
    id={id}
    to={path}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
      ${isActive ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150
        ${isActive ? "bg-teal-600 text-white shadow-sm shadow-teal-200" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"}`}
    >
      <Icon size={16} />
    </div>
    {label}
    {isActive && (
      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
    )}
  </Link>
);

const NavItemChildren = ({
  icon: Icon,
  label,
  path,
  children,
  isExpanded,
  onToggle,
  currentPath,
  onNavClick,
}) => {
  // Determinar si el item padre o alguno de sus hijos esta activo
  const isParentActive = currentPath === path;
  const isChildActive = children.some((child) => currentPath === child.path);
  const isActive = isParentActive || isChildActive;

  return (
    <div className="flex flex-col">
      {/* Item padre con boton para expandir/colapsar */}
      <div className="flex items-center">
        <Link
          to={path}
          onClick={onNavClick}
          className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-l-xl text-sm font-medium transition-all duration-150 group
            ${isActive ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150
              ${isActive ? "bg-teal-600 text-white shadow-sm shadow-teal-200" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"}`}
          >
            <Icon size={16} />
          </div>
          {label}
        </Link>
        {/* Boton para expandir/colapsar submenu */}
        <button
          onClick={onToggle}
          className={`h-full px-2 py-2.5 rounded-r-xl transition-colors duration-150
            ${isActive ? "bg-teal-50 text-teal-600 hover:bg-teal-100" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Submenu colapsable */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="ml-6 pl-4 border-l border-gray-200 mt-1 space-y-1">
          {children.map(
            ({ icon: ChildIcon, label: childLabel, path: childPath }) => {
              const isChildItemActive = currentPath === childPath;
              return (
                <Link
                  key={childPath}
                  to={childPath}
                  onClick={onNavClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${isChildItemActive ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
                >
                  <ChildIcon size={14} />
                  {childLabel}
                  {isChildItemActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </Link>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export { NavItem, NavItemChildren };
