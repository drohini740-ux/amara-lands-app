import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/live-camera-feeds";

// ======================================================
// GET ALL CAMERAS
// ======================================================
export const fetchLiveCameras = async () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ======================================================
// GET SINGLE CAMERA
// ======================================================
export const fetchLiveCamera = async (id) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};