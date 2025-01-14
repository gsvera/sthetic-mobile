import axiosInstance from "@/api";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const InterceptorAxiosProvider = createContext();

const axiosInstances = [axiosInstance];

const ApiRequestProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const interceptRequestHandler = useCallback(
    (config) => {
      config.params = { ...(config?.params ?? {}) };
      config.headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      };
      return config;
    },
    [token]
  );

  const interceptResponseErrorHandler = useCallback((error) => {
    const { status: statusCode, data, headers } = error?.response ?? {};
    if (statusCode === 403 && token) {
      console.log("🚀 ~ interceptResponseErrorHandler ~ error:", error);
      // PARA MANEJO DE ERRORES
      setStoreSession({ key: KEY_STORE.userToken, value: "" });
    }
    // Reject promise if usual error
    if (statusCode !== 401) {
      return Promise.reject(error);
    }
  }, []);

  useEffect(() => {
    const requestInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.request.use(interceptRequestHandler)
    );
    const responseInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.response.use(
        (response) => response,
        interceptResponseErrorHandler
      )
    );

    return () => {
      for (let index = 0; index < axiosInstances.length; index++) {
        const axiosInstance = axiosInstances[index];

        axiosInstance.interceptors.request.eject(requestInterceptors[index]);
        axiosInstance.interceptors.request.eject(responseInterceptors[index]);
      }
    };
  }, [interceptRequestHandler, interceptResponseErrorHandler, token]);

  return (
    <InterceptorAxiosProvider.Provider value={{ axiosInstances, setToken }}>
      {children}
    </InterceptorAxiosProvider.Provider>
  );
};

const useApiProvider = () => {
  return useContext(InterceptorAxiosProvider);
};

export { ApiRequestProvider, useApiProvider };
