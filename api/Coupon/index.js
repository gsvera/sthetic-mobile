import axiosInstance from "..";

const BASE_URL = "/coupon";

export const apiCoupon = {
  getCoupon: function (data) {
    return axiosInstance.get(`${BASE_URL}/get-coupon?code=${data}`);
  },
};
