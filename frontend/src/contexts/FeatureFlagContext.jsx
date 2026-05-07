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
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [maxReviewsPerCase, setMaxReviewsPerCase] = useState(3);

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
      setReviewsEnabled(Boolean(data.reviews_enabled ?? true));
      if (data.max_reviews_per_case !== undefined) {
        setMaxReviewsPerCase(Number(data.max_reviews_per_case));
      }
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

  // Función genérica: actualiza uno o varios flags en una sola llamada
  const updateSetting = async (patch) => {
    const { data } = await settingsService.updateSettings(patch);
    if (data.chat_enabled !== undefined)
      setChatEnabled(Boolean(data.chat_enabled));
    if (data.reviews_enabled !== undefined)
      setReviewsEnabled(Boolean(data.reviews_enabled));
    if (data.max_reviews_per_case !== undefined)
      setMaxReviewsPerCase(Number(data.max_reviews_per_case));
    return data;
  };

  // Retrocompatibilidad con el componente AppSettings existente
  const updateChatEnabled = async (value) => {
    const { data } = await settingsService.setChatEnabled(value);
    setChatEnabled(Boolean(data.chat_enabled));
  };

  return (
    <FeatureFlagContext.Provider
      value={{
        chatEnabled,
        reviewsEnabled,
        maxReviewsPerCase,
        loading,
        error,
        refreshFlags: fetchFlags,
        updateChatEnabled,
        updateSetting,
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
