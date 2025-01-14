import axiosInstance from "..";

const BASE_URL = "/catalog-plan";

export const apiPlan = {
  getAllPlans: function () {
    return axiosInstance.get(`${BASE_URL}/filter/data`);
  },
};
