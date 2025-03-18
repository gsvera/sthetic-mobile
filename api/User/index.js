import axiosInstance from "..";

const BASE_URL = "/user";
const AUTH_BASE_URL = "/auth-user";

export const apiUser = {
  saveUser: function (data) {
    return axiosInstance.post(`${BASE_URL}/save`, data);
  },
  findDuplicateUser: function (email, phone) {
    return axiosInstance.get(
      `${BASE_URL}/find-duplicated-user?email=${email}&phone=${phone}`
    );
  },
  getDataUser: function () {
    return axiosInstance.get(`${AUTH_BASE_URL}/get-data-user`);
  },
  updatePersonalInformation: function (data) {
    return axiosInstance.put(
      `${AUTH_BASE_URL}/update-personel-information`,
      data
    );
  },
  updatePassword: function (value) {
    return axiosInstance.put(
      `${AUTH_BASE_URL}/update-password-by-user?new-password=${value}`
    );
  },
  login: function (data) {
    return axiosInstance.post(`${BASE_URL}/login`, data);
  },
  logout: function () {
    return axiosInstance.post(`${AUTH_BASE_URL}/logout`);
  },
};
