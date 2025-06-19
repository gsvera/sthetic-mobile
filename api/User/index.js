import axiosInstance from "..";

const BASE_URL = "/user";
const AUTH_BASE_URL = "/auth-user";

export const apiUser = {
  saveUser: function (data) {
    return axiosInstance.post(`${BASE_URL}/save/user-sthetic-work`, data);
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
  deleteAccount: function (idUser) {
    return axiosInstance.delete(`${AUTH_BASE_URL}/delete-account/${idUser}`);
  },
  sendVerificationCode: function (data) {
    return axiosInstance.post(`${BASE_URL}/send-verification-code`, data);
  },
  saveResetPassword: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-reset-password`, data);
  },
};
