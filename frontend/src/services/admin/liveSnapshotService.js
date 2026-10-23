
import API from "../api";

const API_URL = "/live-snapshots";

// ======================================================
// GET ALL LIVE SNAPSHOTS
// ======================================================
const getLiveSnapshots = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

// ======================================================
// GET SINGLE LIVE SNAPSHOT
// ======================================================
const getLiveSnapshot = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

// ======================================================
// CREATE LIVE SNAPSHOT
// ======================================================
const createLiveSnapshot = async (snapshotData) => {
  const response = await API.post(API_URL, snapshotData);
  return response.data;
};

// ======================================================
// DELETE LIVE SNAPSHOT
// ======================================================
const deleteLiveSnapshot = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};

// ======================================================
// EXPORT SERVICE
// ======================================================
const liveSnapshotService = {
  getLiveSnapshots,
  getLiveSnapshot,
  createLiveSnapshot,
  deleteLiveSnapshot,
};

export default liveSnapshotService;
