
import API from "../api";

const API_URL = "/intrusion-notifications";

// ======================================================
// GET ALL INTRUSION NOTIFICATIONS
// ======================================================
export const getIntrusionNotifications = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

// ======================================================
// GET SINGLE INTRUSION NOTIFICATION
// ======================================================
export const getIntrusionNotification = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

// ======================================================
// CREATE INTRUSION NOTIFICATION
// ======================================================
export const createIntrusionNotification = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

// ======================================================
// UPDATE INTRUSION NOTIFICATION
// ======================================================
export const updateIntrusionNotification = async (id, data) => {
  const response = await API.put(`${API_URL}/${id}`, data);
  return response.data;
};

// ======================================================
// ACKNOWLEDGE INTRUSION NOTIFICATION
// ======================================================
export const acknowledgeIntrusionNotification = async (id) => {
  const response = await API.put(
    `${API_URL}/${id}/acknowledge`,
    {}
  );

  return response.data;
};

// ======================================================
// RESOLVE INTRUSION NOTIFICATION
// ======================================================
export const resolveIntrusionNotification = async (id) => {
  const response = await API.patch(
    `${API_URL}/${id}/resolve`,
    {}
  );

  return response.data;
};

// ======================================================
// DELETE INTRUSION NOTIFICATION
// ======================================================
export const deleteIntrusionNotification = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};
