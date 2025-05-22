import axiosInstance from "..";

const BASE_URL = "/auth-user-config";

export const apiUserConfig = {
  getLocationByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-location-by-provider?id-user=${idUser}`
    );
  },
  getInfoCompany: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-info-company-by-user/${idUser}`);
  },
  getPlanByUser: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-my-current-plan/${idUser}`);
  },
  saveLocation: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-location`, data);
  },
  saveProfilePicture: function (data) {
    return axiosInstance.put(`${BASE_URL}/save-profile-picture`, data);
  },
  updateInfoCompany: function (data) {
    return axiosInstance.put(`${BASE_URL}/update-info-company`, data);
  },
};

export default apiUserConfig;
