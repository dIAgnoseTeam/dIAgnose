import Header from "../ui/Header";
import Navbar from "../ui/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ✅ h-screen + overflow-hidden, no min-h-screen */}
      <Navbar />
      <div className="ml-64 flex flex-col h-full">
        {/* ✅ h-full, no min-h-screen */}
        <Header />
        <main className="flex-1 min-h-0 overflow-hidden p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
