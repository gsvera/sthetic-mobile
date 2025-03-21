import axiosInstance from "..";

const BASE_URL = "/catalog-type-service";
const BASE_AUTH_URL = "/auth/catalog-type-user-service";

export const apiTypeService = {
  getAll: function () {
    return axiosInstance.get(`${BASE_URL}/all`);
  },
  getByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_AUTH_URL}/get-type-service-by-user?id-user=${idUser}`
    );
  },
  saveTypeServiceByUser: function (data) {
    return axiosInstance.post(
      `${BASE_AUTH_URL}/save-type-service-by-user`,
      data
    );
  },
};

export default apiTypeService;
