import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PropagateLoader } from "react-spinners";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  const [loading] = useState(true);
  const [color] = useState("#1e3a8a"); // color azul oscuro

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS" },
        window.location.origin
      );
      window.close();
    } else {
      handleCallback().then(() => navigate("/"));
    }
  }, [handleCallback, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <PropagateLoader
        color={color}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
