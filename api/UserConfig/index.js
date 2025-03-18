import axiosInstance from "..";

const BASE_URL = "/auth-user-config";

export const apiUserConfig = {
  getLocationByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-location-by-user?id-user=${idUser}`
    );
  },
  saveLocation: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-location`, data);
  },
};

export default apiUserConfig;
