const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "",
};

export default config;
export const API_BASE = config.API_BASE_URL;
