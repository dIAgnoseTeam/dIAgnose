import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatureFlags } from "../../contexts/FeatureFlagContext";
import { NavItem, NavItemChildren } from "./NavItem";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Brain,
  BotMessageSquare,
  X,
  Users,
  FileText,
  Settings2,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: BotMessageSquare, label: "Chat", id: "chat", path: "/chat" },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/dashboard",
    children: [
      { icon: Users, label: "Usuarios", path: "/dashboard/users" },
      { icon: FileText, label: "Casos clínicos", path: "/dashboard/cases" },
      { icon: Settings2, label: "Ajustes", path: "/dashboard/settings" },
    ],
  },
];

const Navbar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { chatEnabled } = useFeatureFlags();
  const [expandedItem, setExpandedItem] = useState("dashboard");

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

  const handleToggle = (id) => {
    setExpandedItem((prev) => (prev === id ? null : id));
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
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const { id, icon, label, path, children } = item;

          if (children) {
            return (
              <NavItemChildren
                key={id}
                icon={icon}
                label={label}
                path={path}
                children={children}
                isExpanded={expandedItem === id}
                onToggle={() => handleToggle(id)}
                currentPath={location.pathname}
                onNavClick={handleNavClick}
              />
            );
          }

          return (
            <NavItem
              id={id}
              key={id}
              icon={icon}
              label={label}
              path={path}
              isActive={location.pathname === path}
              onClick={handleNavClick}
            />
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
