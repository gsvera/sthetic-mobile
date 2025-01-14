import axiosInstance from "..";

const BASE_URL = "/catalog-lada-phone";

export const apiLada = {
  getFilterData: function () {
    return axiosInstance.get(`${BASE_URL}`);
  },
};
