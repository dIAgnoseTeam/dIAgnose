import { useState } from "react";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";

const MainLayout = ({ children, scrollable = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay para movil cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="lg:ml-64 flex flex-col h-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main
          className={`flex-1 min-h-0 overflow-hidden p-4 sm:p-6 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
