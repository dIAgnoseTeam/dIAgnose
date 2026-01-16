import GoogleIcon from "../components/icons/Google";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./../assets/styles/login.css";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const error = searchParams.get("error");

  return (
    <div className="login-container h-dvh flex justify-center items-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-900">
          Iniciar Sesión
        </h2>
        <button
          className="flex gap-3 items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded shadow w-full justify-center"
          onClick={login}
        >
          <GoogleIcon />
          Continuar con Google
        </button>
        {error && (
          <div className="mt-4 text-red-600 text-center">
            Error de autenticación: {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
