import axiosInstance from "..";

const BASE_URL = "/calendar";

export const apiCalendar = {
  getCalendarByUser: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-calendar-by-user/${idUser}`);
  },
  getCalencarExceptionByUser: function (idUser, date) {
    return axiosInstance.get(
      `${BASE_URL}/get-calendar-exception-by-user/${idUser}?date-tostring=${date}`
    );
  },
  getTimeCalendarByPovider: function (iProvider, day, date) {
    return axiosInstance.get(
      `${BASE_URL}/get-time-by-provider/${iProvider}?day=${day}&date=${date}`
    );
  },
  getServicesByProvider: function (idProvider) {
    return axiosInstance.get(
      `${BASE_URL}/get-services-by-provider/${idProvider}`
    );
  },
  saveCalendar: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-calendar`, data);
  },
  saveExceptionDay: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-calendar-exception`, data);
  },
  updateExceptionDay: function (data) {
    return axiosInstance.put(`${BASE_URL}/update-calendar-exception`, data);
  },
  deleteCalendarException: function (id) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-calendar-exception?id-exception=${id}`
    );
  },
};
