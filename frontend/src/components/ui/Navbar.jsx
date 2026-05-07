import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatureFlags } from "../../contexts/FeatureFlagContext";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Brain,
  BotMessageSquare,
  X,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: BotMessageSquare, label: "Chat", id: "chat", path: "/chat" },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/dashboard",
  },
];

const Navbar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { chatEnabled } = useFeatureFlags();

  const filteredNavItems = navItems.filter((item) => {
    if (item.id === "dashboard") return user?.rol === "admin";
    if (item.id === "chat") return chatEnabled;
    return true;
  });

  const handleNavClick = () => {
    // Cerrar el sidebar en mobile al navegar
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <aside
      className={`
        w-64 h-dvh flex flex-col bg-white border-r border-gray-100 shadow-sm fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-100">
            <Brain size={20} className="text-white" />
          </div>
          <main className="flex flex-col leading-tight">
            <span className="text-gray-800 font-bold text-lg tracking-tight">
              d<span className="text-teal-600">IA</span>gnose
            </span>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">
              IA Atenci&oacute;n Primaria
            </span>
          </main>
        </div>
        {/* Boton cerrar solo visible en mobile */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {filteredNavItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <NavItem
              key={id}
              icon={icon}
              label={label}
              path={path}
              isActive={location.pathname === path}
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150
                ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-200"
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                }`}
              >
                <Icon size={16} />
              </div>
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-gray-100 pt-3 pb-5 px-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 px-3 py-2.5 transition-all duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-150">
            <LogOut size={16} />
          </div>
          Cerrar sesi&oacute;n
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
