import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/intrusion-notifications";

// Get token
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET ALL INTRUSION NOTIFICATIONS
// ======================================================
export const getIntrusionNotifications = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// GET SINGLE INTRUSION NOTIFICATION
// ======================================================
export const getIntrusionNotification = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// CREATE INTRUSION NOTIFICATION
// ======================================================
export const createIntrusionNotification = async (
  data
) => {
  const response = await axios.post(
    API_URL,
    data,
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// UPDATE INTRUSION NOTIFICATION
// ======================================================
export const updateIntrusionNotification = async (
  id,
  data
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// ACKNOWLEDGE
// ======================================================
export const acknowledgeIntrusionNotification = async (
  id
) => {
  const response = await axios.put(
    `${API_URL}/${id}/acknowledge`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// RESOLVE
// ======================================================
export const resolveIntrusionNotification = async (
  id
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/resolve`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// ======================================================
// DELETE
// ======================================================
export const deleteIntrusionNotification = async (
  id
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};