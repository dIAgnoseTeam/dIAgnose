import React from "react";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="w-full bg-white border-b border-gray-100 px-8 py-3 flex justify-end items-center gap-4 sticky top-0 z-40">
      {/* Fecha */}
      <div className="text-right border-r border-gray-100 pr-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          Fecha de hoy
        </p>
        <p className="text-sm text-gray-600 font-medium capitalize">{today}</p>
      </div>

      {/* Usuario */}
      <div className="text-right">
        <p className="text-sm text-gray-700 font-semibold leading-tight">
          {user.name}
        </p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>

      {/* Avatar */}
      {user.picture ? (
        <img
          src={user.picture}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
        />
      ) : (
        <div className="w-9 h-9 rounded-full ring-2 ring-gray-100 bg-teal-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </header>
  );
}

export default Header;
