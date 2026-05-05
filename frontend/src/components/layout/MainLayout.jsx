import Header from "../ui/Header";
import Navbar from "../ui/Navbar";

const MainLayout = ({ children, scrollable = false }) => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="ml-64 flex flex-col h-full">
        <Header />
        <main
          className={`flex-1 min-h-0 overflow-hidden p-6 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
