import { useState, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 1500);
  }, []);

  return { toast, showToast };
};
