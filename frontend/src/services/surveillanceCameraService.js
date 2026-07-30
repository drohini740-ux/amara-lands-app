import api from "./api";

// Get All Cameras
export const getSurveillanceCameras = async () => {
  const response = await api.get("/surveillance-cameras");
  return response.data;
};

// Get Single Camera
export const getSurveillanceCamera = async (id) => {
  const response = await api.get(`/surveillance-cameras/${id}`);
  return response.data;
};

// Add Camera
export const addSurveillanceCamera = async (cameraData) => {
  const response = await api.post("/surveillance-cameras", cameraData);
  return response.data;
};

// Update Camera
export const updateSurveillanceCamera = async (id, cameraData) => {
  const response = await api.put(`/surveillance-cameras/${id}`, cameraData);
  return response.data;
};

// Delete Camera
export const deleteSurveillanceCamera = async (id) => {
  const response = await api.delete(`/surveillance-cameras/${id}`);
  return response.data;
};