import axiosInstance from "..";

const BASE_URL = "/schedule-service";

export const apiSchedule = {
  findAllByDay: function (idUser, date) {
    return axiosInstance.get(
      `${BASE_URL}/find-all-by-provider/${idUser}?date=${date}`
    );
  },
  acceptSchedule: function (idSchedule) {
    return axiosInstance.patch(
      `${BASE_URL}/accept-schedule-by-provider?id-schedule=${idSchedule}`
    );
  },
  rejectSchedule: function ({ idSchedule, textReject }) {
    return axiosInstance.patch(
      `${BASE_URL}/reject-schedule-by-provider?id-schedule=${idSchedule}&text-reject=${textReject}`
    );
  },
};
