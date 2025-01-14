import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.0.11:8002/api/esthetic",
});

// axios.defaults.withCredentials = true;
axiosInstance.defaults.withCredentials = false;

const isStatusError = (error) => {
  return error.response.status === 401 || error.response.status === 403;
};

axiosInstance.defaults.headers.common["Accept-Language"] = "es";

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && isStatusError(error)) {
      // mostrar mensaje de error generico, capaz desloguear
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
