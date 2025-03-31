import axiosInstance from "..";

const BASE_URL = "/auth/catalog-type-user-service";

export const apiCatalogUserService = {
  saveCatalogService: function (data) {
    return axiosInstance.post(`${BASE_URL}/save`, data);
  },
  getCatalogServiceByUser: function (id) {
    return axiosInstance.get(`${BASE_URL}/service-get-by-user/${id}`);
  },
  deleteProject: function (id) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-catalog-service-by-id/${id}`
    );
  },
};

export default apiCatalogUserService;
