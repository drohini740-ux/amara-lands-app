import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/admin/security-monitoring/dashboard";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getSecurityMonitoringDashboard = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};