import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/motion-detection-alerts";

// ======================================================
// GET ALL MOTION DETECTION ALERTS
// ======================================================
export const getMotionDetectionAlerts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ======================================================
// GET SINGLE MOTION DETECTION ALERT
// ======================================================
export const getMotionDetectionAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ======================================================
// CREATE MOTION DETECTION ALERT
// ======================================================
export const createMotionDetectionAlert = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// ======================================================
// ADD MOTION DETECTION ALERT
// ======================================================
export const addMotionDetectionAlert = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// ======================================================
// UPDATE MOTION DETECTION ALERT
// ======================================================
export const updateMotionDetectionAlert = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ======================================================
// DELETE MOTION DETECTION ALERT
// ======================================================
export const deleteMotionDetectionAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ======================================================
// ACKNOWLEDGE MOTION DETECTION ALERT
// ======================================================
export const acknowledgeMotionDetectionAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}/acknowledge`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ======================================================
// RESOLVE MOTION DETECTION ALERT
// ======================================================
export const resolveMotionDetectionAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/${id}/resolve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};