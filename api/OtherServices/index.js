import axios from "axios";

const axiosInstance = axios.create();

export const apiOtherServices = {
  getInverserGeo: function (location) {
    const { latitude, longitude } = location;
    return axiosInstance.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    );
  },
};
