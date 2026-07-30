import api from "./api";

// Get All
export const getGeoReports = async () => {
  const response = await api.get("/geo-tagged-reports");
  return response.data;
};

// Get Single
export const getGeoReport = async (id) => {
  const response = await api.get(`/geo-tagged-reports/${id}`);
  return response.data;
};

// Add
export const addGeoReport = async (reportData) => {
  const response = await api.post("/geo-tagged-reports", reportData);
  return response.data;
};

// Update
export const updateGeoReport = async (id, reportData) => {
  const response = await api.put(`/geo-tagged-reports/${id}`, reportData);
  return response.data;
};

// Delete
export const deleteGeoReport = async (id) => {
  const response = await api.delete(`/geo-tagged-reports/${id}`);
  return response.data;
};