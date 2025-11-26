import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      className="max-w-screen-2xl mx-auto m-2 h-16 
                bg-neutral-50 border border-neutral-200
                flex items-center px-4 rounded-2xl shadow-sm"
    >
      <div className="max-w-screen-xl w-full mx-auto flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-primary-700 font-bold text-xl">Diagnose</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/test-registros"
            className="text-neutral-700 hover:text-primary-600 transition"
          >
            Ver Registros
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && <span className="text-neutral-700">{user.name}</span>}
          <button
            onClick={logout}
            className="bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
