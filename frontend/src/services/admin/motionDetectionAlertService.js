
import API from "../api";

const API_URL = "/motion-detection-alerts";

// ======================================================
// GET ALL MOTION DETECTION ALERTS
// ======================================================
export const getMotionDetectionAlerts = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

// ======================================================
// GET SINGLE MOTION DETECTION ALERT
// ======================================================
export const getMotionDetectionAlert = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

// ======================================================
// CREATE MOTION DETECTION ALERT
// ======================================================
export const createMotionDetectionAlert = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

// ======================================================
// ADD MOTION DETECTION ALERT
// Keep this export for existing imports.
// ======================================================
export const addMotionDetectionAlert = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

// ======================================================
// UPDATE MOTION DETECTION ALERT
// ======================================================
export const updateMotionDetectionAlert = async (id, data) => {
  const response = await API.put(`${API_URL}/${id}`, data);
  return response.data;
};

// ======================================================
// DELETE MOTION DETECTION ALERT
// ======================================================
export const deleteMotionDetectionAlert = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};

// ======================================================
// ACKNOWLEDGE MOTION DETECTION ALERT
// ======================================================
export const acknowledgeMotionDetectionAlert = async (id) => {
  const response = await API.put(
    `${API_URL}/${id}/acknowledge`,
    {}
  );

  return response.data;
};

// ======================================================
// RESOLVE MOTION DETECTION ALERT
// ======================================================
export const resolveMotionDetectionAlert = async (id) => {
  const response = await API.patch(
    `${API_URL}/${id}/resolve`,
    {}
  );

  return response.data;
};
