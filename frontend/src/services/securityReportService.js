import api from "./api";
console.log("✅ Security Report Routes Loaded");
// Get all security reports
export const getSecurityReports = async () => {
  const response = await api.get("/security-reports");
  return response.data;
};

// Get single security report
export const getSecurityReport = async (id) => {
  const response = await api.get(`/security-reports/${id}`);
  return response.data;
};

// Add security report
export const addSecurityReport = async (reportData) => {
  const response = await api.post("/security-reports", reportData);
  return response.data;
};

// Update security report
export const updateSecurityReport = async (id, reportData) => {
  const response = await api.put(`/security-reports/${id}`, reportData);
  return response.data;
};

// Delete security report
export const deleteSecurityReport = async (id) => {
  const response = await api.delete(`/security-reports/${id}`);
  return response.data;
};