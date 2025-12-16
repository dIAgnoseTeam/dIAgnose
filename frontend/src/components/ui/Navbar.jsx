import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import defaultPic from "./../../assets/images/default_userpic.png";
import { FileText } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  //console.log(user);

  return (
    <nav
      className="max-w-screen-2xl  xl:max-w-screen-xl mx-auto m-2 p-4 
                bg-neutral-50 border border-neutral-200
                flex items-center rounded-2xl shadow-sm"
    >
      <div className=" max-w-screen-xl w-full mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link to="/">
          <h1 className="text-primary-700 font-bold text-xl">Diagnose</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/test-registros"
            className="text-neutral-700 hover:text-primary-600 transition hover:bg-neutral-100 p-2 rounded-lg flex gap-2"
          >
            <FileText />
            Ver Registros
          </Link>
        </div>
        <div className="flex items-center space-x-4 border-l-2 border-primary-800 pl-6">
          {user && (
            <Link to="/profile" className="hover:underline">
              <span className="text-neutral-700 flex items-center gap-2">
                <img
                  src={user.picture || defaultPic}
                  alt="User profile"
                  className="w-8 h-8 rounded-full"
                />
                {user.name}
              </span>
            </Link>
          )}
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
