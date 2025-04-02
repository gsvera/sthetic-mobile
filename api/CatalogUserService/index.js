import axiosInstance from "..";

const BASE_URL = "/auth/catalog-type-user-service";

export const apiCatalogUserService = {
  saveCatalogService: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-catalog-user-service`, data);
  },
  updateCatalogService: function (data) {
    return axiosInstance.put(`${BASE_URL}/update-catalog-user-service`, data);
  },
  getCatalogServiceByUser: function (id) {
    return axiosInstance.get(`${BASE_URL}/service-get-by-user/${id}`);
  },
  getToEditCatalogService: function (id) {
    return axiosInstance.get(`${BASE_URL}/get-catalog-service-by-id/${id}`);
  },
  deleteProject: function (id) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-catalog-service-by-id/${id}`
    );
  },
};

export default apiCatalogUserService;
