
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const SecurityLiveMonitoring = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchCameras = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/surveillance-cameras");

      const result = response.data?.data;
      const cameraList = Array.isArray(result)
        ? result
        : Array.isArray(result?.cameras)
        ? result.cameras
        : Array.isArray(response.data?.cameras)
        ? response.data.cameras
        : [];

      setCameras(cameraList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load cameras. Please check the backend and login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const filteredCameras = cameras.filter((camera) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      camera.camera_name,
      camera.camera_location,
      camera.property_name,
      camera.survey_number,
    ].some((value) => String(value || "").toLowerCase().includes(searchText));

    const matchesStatus =
      filterStatus === "All" ||
      String(camera.status || "").toLowerCase() ===
        filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const activeCount = cameras.filter(
    (camera) => String(camera.status || "").toLowerCase() === "active"
  ).length;

  const offlineCount = cameras.filter(
    (camera) => String(camera.status || "").toLowerCase() === "offline"
  ).length;

  const cardStyle = {
    background: "#181818",
    border: "1px solid #353535",
    borderRadius: "12px",
    padding: "20px",
  };

  const buttonStyle = {
    background: "#c9a227",
    color: "#111",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        background: "#101010",
        color: "#fff",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ color: "#c9a227", margin: 0 }}>Live Monitoring</h1>
          <p style={{ color: "#aaa" }}>
            Monitor registered security cameras and their current status.
          </p>
        </div>

        <button style={buttonStyle} onClick={fetchCameras}>
          Refresh Cameras
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <p style={{ color: "#aaa" }}>Total Cameras</p>
          <h2>{cameras.length}</h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#aaa" }}>Active Cameras</p>
          <h2 style={{ color: "#4ade80" }}>{activeCount}</h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#aaa" }}>Offline Cameras</p>
          <h2 style={{ color: "#f87171" }}>{offlineCount}</h2>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search camera or property..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "12px",
            background: "#202020",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "6px",
          }}
        />

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          style={{
            padding: "12px",
            background: "#202020",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "6px",
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Offline">Offline</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {loading && <p>Loading cameras...</p>}

      {error && (
        <div
          style={{
            background: "#351818",
            color: "#ffb4b4",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && filteredCameras.length === 0 && (
        <div style={cardStyle}>
          <p>No cameras found.</p>
          <p style={{ color: "#aaa" }}>
            Add cameras in Surveillance Cameras before monitoring them.
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {filteredCameras.map((camera) => {
          const isActive =
            String(camera.status || "").toLowerCase() === "active";

          return (
            <div key={camera.id} style={cardStyle}>
              <div
                style={{
                  height: "150px",
                  background: "#242424",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "38px" }}>📹</div>
                  <p style={{ color: "#aaa", marginBottom: 0 }}>
                    {isActive
                      ? "Camera registered · Feed not connected"
                      : "Camera currently unavailable"}
                  </p>
                </div>
              </div>

              <h3 style={{ color: "#c9a227", marginBottom: "10px" }}>
                {camera.camera_name || `Camera ${camera.id}`}
              </h3>

              <p>
                <strong>Property:</strong>{" "}
                {camera.property_name || "Not assigned"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {camera.camera_location || "Not specified"}
              </p>

              <p>
                <strong>Camera Type:</strong>{" "}
                {camera.camera_type || "Not specified"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: isActive ? "#4ade80" : "#f87171" }}>
                  {camera.status || "Unknown"}
                </span>
              </p>

              <div
                style={{
                  borderTop: "1px solid #353535",
                  paddingTop: "12px",
                  marginTop: "12px",
                  color: "#aaa",
                  fontSize: "13px",
                }}
              >
                Live video requires a connected camera stream. This page
                currently displays camera records and their reported status.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityLiveMonitoring;
