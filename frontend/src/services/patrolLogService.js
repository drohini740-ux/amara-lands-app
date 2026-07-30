import api from "./api";

// Get All
export const getPatrolLogs = async () => {
  const response = await api.get("/patrol-logs");
  return response.data;
};

// Get Single
export const getPatrolLog = async (id) => {
  const response = await api.get(`/patrol-logs/${id}`);
  return response.data;
};

// Add
export const addPatrolLog = async (logData) => {
  const response = await api.post("/patrol-logs", logData);
  return response.data;
};

// Update
export const updatePatrolLog = async (id, logData) => {
  const response = await api.put(`/patrol-logs/${id}`, logData);
  return response.data;
};

// Delete
export const deletePatrolLog = async (id) => {
  const response = await api.delete(`/patrol-logs/${id}`);
  return response.data;
};