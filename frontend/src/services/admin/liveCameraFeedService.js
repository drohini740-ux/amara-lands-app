
import API from "../api";

const API_URL = "/live-camera-feeds";

// ======================================================
// GET ALL CAMERAS
// ======================================================
export const fetchLiveCameras = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

// ======================================================
// GET SINGLE CAMERA
// ======================================================
export const fetchLiveCamera = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};
