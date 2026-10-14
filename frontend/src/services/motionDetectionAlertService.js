
import api from "./api";

const BASE_URL = "/security/motion-alerts";

// Fetch all alerts, with optional filters.
export const getMotionDetectionAlerts = async (filters = {}) => {
  const response = await api.get(BASE_URL, {
    params: filters,
  });

  return response.data;
};

// Fetch one alert by ID.
export const getMotionDetectionAlertById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);

  return response.data;
};

// Update an alert's status or remarks.
export const updateMotionDetectionAlert = async (id, payload) => {
  const response = await api.patch(`${BASE_URL}/${id}`, payload);

  return response.data;
};
export const createMotionDetectionAlert = async (payload) => {
  const response = await api.post("/security/motion-alerts", payload);
  return response.data;
};

export default {
  getMotionDetectionAlerts,
  getMotionDetectionAlertById,
  updateMotionDetectionAlert,
  createMotionDetectionAlert,
};
