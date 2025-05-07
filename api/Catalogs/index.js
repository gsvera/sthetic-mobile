import axiosInstance from "..";

const BASE_URL = "/catalog";

export const apiCatalogs = {
  getAllGeoState: function () {
    return axiosInstance.get(`${BASE_URL}/catalog-geo-state/get-all`);
  },
  getMunicipalityByState: function (idState) {
    return axiosInstance.get(
      `${BASE_URL}/catalog-geo-municipality-by-state?id-state=${idState}`
    );
  },
};

export default apiCatalogs;
