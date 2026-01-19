import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";
import { API_BASE } from "../config/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setError("Failed to authenticate user.");
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const apiUrl = API_BASE;
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${apiUrl}/auth/google/login`,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener("message", handleAuthMessage);
  };

  const handleAuthMessage = (event) => {
    // Verificar el origen por seguridad
    if (event.origin !== window.location.origin) return;

    if (event.data.type === "AUTH_SUCCESS") {
      // Guardar el token y redirigir
      handleCallback(event.data.token);
      window.removeEventListener("message", handleAuthMessage);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);

      window.location.href = "/login";
    }
  };

  const handleCallback = async (token) => {
    localStorage.setItem("token", token);
    checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        handleCallback,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
