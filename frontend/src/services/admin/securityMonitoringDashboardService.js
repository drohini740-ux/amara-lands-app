import API from "../api";

const API_URL = "/admin/security-monitoring/dashboard";

// ======================================================
// GET SECURITY MONITORING DASHBOARD
// ======================================================
export const getSecurityMonitoringDashboard = async () => {
  const response = await API.get(API_URL);
  return response.data;
};
