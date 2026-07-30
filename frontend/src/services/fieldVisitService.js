import api from "./api";

// Get all field visits
export const getFieldVisits = async () => {
  const response = await api.get("/field-visits");
  return response.data;
};

// Get single field visit
export const getFieldVisit = async (id) => {
  const response = await api.get(`/field-visits/${id}`);
  return response.data;
};

// Add field visit
export const addFieldVisit = async (visitData) => {
  const response = await api.post("/field-visits", visitData);
  return response.data;
};

// Update field visit
export const updateFieldVisit = async (id, visitData) => {
  const response = await api.put(`/field-visits/${id}`, visitData);
  return response.data;
};

// Delete field visit
export const deleteFieldVisit = async (id) => {
  const response = await api.delete(`/field-visits/${id}`);
  return response.data;
};