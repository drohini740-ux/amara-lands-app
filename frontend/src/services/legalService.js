import api from "./api";

// Get all legal cases
export const getLegalCases = async () => {
  const res = await api.get("/legal");
  return res.data;
};

// Add legal case
export const addLegalCase = async (data) => {
  const res = await api.post("/legal", data);
  return res.data;
};

// Delete legal case
export const deleteLegalCase = async (id) => {
  const res = await api.delete(`/legal/${id}`);
  return res.data;
};

// Get single legal case
export const getLegalCase = async (id) => {
  const res = await api.get(`/legal/${id}`);
  return res.data;
};

// Update legal case
export const updateLegalCase = async (id, data) => {
  const res = await api.put(`/legal/${id}`, data);
  return res.data;
};