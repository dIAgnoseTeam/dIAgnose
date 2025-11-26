import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HashLoader } from "react-spinners";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  const [loading] = useState(true);
  const [color] = useState("#1e3a8a"); // color azul oscuro

  useEffect(() => {
    const token = searchParams.get("token");

    if (token && window.opener) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS", token },
        window.location.origin
      );
      handleCallback(token);
      navigate("/");
      window.close();
    } else {
      navigate("/login?error=no_token");
    }
  }, [handleCallback, navigate, searchParams]);

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <HashLoader
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
