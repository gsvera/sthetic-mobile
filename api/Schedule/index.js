import axiosInstance from "..";

const BASE_URL = "/schedule-service";

export const apiSchedule = {
  findAllByDay: function (idUser, date, statusSchedule) {
    return axiosInstance.get(
      `${BASE_URL}/find-all-by-provider/${idUser}?date=${date}${
        statusSchedule === undefined ? "" : "&status-schedule=" + statusSchedule
      }`
    );
  },
  changeStatusSchedule: function ({
    idSchedule,
    statusSchedule,
    textComments = null,
  }) {
    return axiosInstance.patch(
      `${BASE_URL}/change-status-schedule?id-schedule=${idSchedule}&status-schedule=${statusSchedule}${
        textComments ? "&text-comments=" + textComments : ""
      }`
    );
  },
};
