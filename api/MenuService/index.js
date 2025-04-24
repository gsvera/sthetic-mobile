import axiosInstance from "..";

const BASE_URL = "/auth/menu-service";

export const apiMenuService = {
  getListMenuServicesByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-menu-service-by-user-id/${idUser}`
    );
  },
  getMenuServiceById: function (id) {
    return axiosInstance.get(
      `${BASE_URL}/get-menu-service-by-id?id-menu-service=${id}`
    );
  },
  saveMenuService: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-menu-service`, data);
  },
  updateMenuService: function (data) {
    return axiosInstance.put(`${BASE_URL}/update-menu-service`, data);
  },
  deleteMenuService: function (idUser, idMenuService) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-menu-service-by-id/${idUser}?id-menu-service=${idMenuService}`
    );
  },
};

export default apiMenuService;
