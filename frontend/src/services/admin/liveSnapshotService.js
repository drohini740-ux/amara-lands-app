import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/live-snapshots";

// Get JWT token
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all live snapshots
const getLiveSnapshots = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

// Get single live snapshot
const getLiveSnapshot = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Create live snapshot
const createLiveSnapshot = async (snapshotData) => {
  const response = await axios.post(
    API_URL,
    snapshotData,
    getAuthConfig()
  );

  return response.data;
};

// Delete live snapshot
const deleteLiveSnapshot = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

const liveSnapshotService = {
  getLiveSnapshots,
  getLiveSnapshot,
  createLiveSnapshot,
  deleteLiveSnapshot,
};

export default liveSnapshotService;