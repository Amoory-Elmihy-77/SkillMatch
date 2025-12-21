import axios from "axios";

const api = axios.create({
  // baseURL: "http://51.21.195.176:4000/api",
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        try {
          localStorage.removeItem("token");
        } catch {
          // ignore localStorage errors
        }
        try {
          window.dispatchEvent(
            new CustomEvent("api:unauthorized", {
              detail: { message: data?.message || "Unauthorized" },
            })
          );
        } catch {
          // ignore if CustomEvent is not supported
        }
      }

      const normalized = new Error(data?.message || "Request failed");
      normalized.status = status;
      normalized.data = data;
      return Promise.reject(normalized);
    }

    if (error.request) {
      const networkErr = new Error(
        "Network error. Please check your connection."
      );
      networkErr.status = null;
      return Promise.reject(networkErr);
    }

    return Promise.reject(error);
  }
);

export default api;
