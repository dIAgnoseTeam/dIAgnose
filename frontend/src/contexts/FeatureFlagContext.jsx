import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { settingsService } from "../services/api";
import { useAuth } from "./AuthContext";

const FeatureFlagContext = createContext(null);

export const FeatureFlagProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [chatEnabled, setChatEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlags = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await settingsService.getSettings();
      setChatEnabled(Boolean(data.chat_enabled));
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los settings: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchFlags();
    }
  }, [authLoading, fetchFlags]);

  const updateChatEnabled = async (value) => {
    const { data } = await settingsService.setChatEnabled(value);
    setChatEnabled(Boolean(data.chat_enabled));
  };

  return (
    <FeatureFlagContext.Provider
      value={{
        chatEnabled,
        loading,
        error,
        refreshFlags: fetchFlags,
        updateChatEnabled,
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }
  return ctx;
};
