import api from "./api";

// Get All Consultations
export const getConsultations = async () => {
  const response = await api.get("/consultations");
  return response.data;
};

// Get Single Consultation
export const getConsultation = async (id) => {
  const response = await api.get(`/consultations/${id}`);
  return response.data;
};

// Add Consultation
export const addConsultation = async (consultationData) => {
  const response = await api.post("/consultations", consultationData);
  return response.data;
};

// Update Consultation
export const updateConsultation = async (id, consultationData) => {
  const response = await api.put(
    `/consultations/${id}`,
    consultationData
  );
  return response.data;
};

// Delete Consultation
export const deleteConsultation = async (id) => {
  const response = await api.delete(`/consultations/${id}`);
  return response.data;
};