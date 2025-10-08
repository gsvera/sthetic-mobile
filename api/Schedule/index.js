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
  getTempClients: function (idProvider) {
    return axiosInstance.get(
      `${BASE_URL}/get-temp-client-by-provider/${idProvider}`
    );
  },
  deleteTempClient: function (idContact, idProvider) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-temp-contact-by-provider/${idProvider}?id-temp-contact=${idContact}`
    );
  },
  makeOurScheduleService: function (data) {
    return axiosInstance.post(`${BASE_URL}/make-our-schedule-service`, data);
  },
};
