import Header from "../ui/Header";
import Navbar from "../ui/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;