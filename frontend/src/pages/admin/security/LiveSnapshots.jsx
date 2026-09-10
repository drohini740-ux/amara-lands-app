import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaCamera,
  FaSearch,
  FaEye,
  FaTrash,
  FaSyncAlt,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
} from "react-icons/fa";

import {
  fetchLiveSnapshots,
  removeLiveSnapshot,
} from "../../../redux/liveSnapshotSlice";

const LiveSnapshots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { snapshots, loading, error } = useSelector(
    (state) => state.liveSnapshots
  );

  const [search, setSearch] = useState("");

  // ===============================
  // FETCH SNAPSHOTS
  // ===============================
  useEffect(() => {
    dispatch(fetchLiveSnapshots());
  }, [dispatch]);

  // ===============================
  // REFRESH
  // ===============================
  const handleRefresh = () => {
    dispatch(fetchLiveSnapshots());
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this live snapshot?"
    );

    if (confirmDelete) {
      dispatch(removeLiveSnapshot(id));
    }
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredSnapshots = snapshots.filter((snapshot) => {
    const searchText = search.toLowerCase();

    return (
      snapshot.camera_name?.toLowerCase().includes(searchText) ||
      snapshot.property_name?.toLowerCase().includes(searchText) ||
      snapshot.camera_location?.toLowerCase().includes(searchText) ||
      snapshot.camera_type?.toLowerCase().includes(searchText)
    );
  });

  // ===============================
  // DATE FORMAT
  // ===============================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="container-fluid p-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <button
            className="btn btn-outline-dark mb-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" />
            Back
          </button>

          <h2 className="fw-bold mb-1">
            <FaCamera className="me-2" />
            Live Snapshots
          </h2>

          <p className="text-muted mb-0">
            Monitor and manage surveillance camera snapshots
          </p>
        </div>

        <button
          className="btn btn-dark"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaSyncAlt className="me-2" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ================= SUMMARY ================= */}
      <div className="row mb-4">

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Total Snapshots
                  </p>

                  <h3 className="fw-bold mb-0">
                    {snapshots.length}
                  </h3>
                </div>

                <FaCamera size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Active Cameras
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      new Set(
                        snapshots
                          .filter(
                            (snapshot) =>
                              snapshot.camera_status === "Active"
                          )
                          .map((snapshot) => snapshot.camera_id)
                      ).size
                    }
                  </h3>
                </div>

                <FaCamera size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Properties Covered
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      new Set(
                        snapshots.map(
                          (snapshot) => snapshot.property_id
                        )
                      ).size
                    }
                  </h3>
                </div>

                <FaBuilding size={32} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= SEARCH ================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text bg-dark text-white">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by camera, property, location or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading && snapshots.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>

          <p className="mt-3">
            Loading live snapshots...
          </p>
        </div>
      ) : filteredSnapshots.length === 0 ? (

        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">

            <FaCamera size={50} className="text-muted mb-3" />

            <h5>No Live Snapshots Found</h5>

            <p className="text-muted mb-0">
              No snapshots match your search.
            </p>

          </div>
        </div>

      ) : (

        /* ================= SNAPSHOT CARDS ================= */

        <div className="row">

          {filteredSnapshots.map((snapshot) => (

            <div
              className="col-xl-4 col-lg-6 col-md-6 mb-4"
              key={snapshot.id}
            >

              <div className="card shadow-sm border-0 h-100">

                {/* SNAPSHOT IMAGE */}
                <div
                  style={{
                    height: "220px",
                    background: "#f5f5f5",
                    overflow: "hidden",
                  }}
                >

                  <img
                    src={snapshot.snapshot_url}
                    alt={`Snapshot from ${snapshot.camera_name}`}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                          <div class="text-center">
                            <div style="font-size:40px;">📷</div>
                            <div>Snapshot unavailable</div>
                          </div>
                        </div>
                      `;
                    }}
                  />

                </div>

                {/* CARD BODY */}
                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                      <h5 className="fw-bold mb-1">
                        {snapshot.camera_name || "Unknown Camera"}
                      </h5>

                      <span className="badge bg-dark">
                        {snapshot.camera_type || "Camera"}
                      </span>
                    </div>

                    <span
                      className={`badge ${
                        snapshot.camera_status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {snapshot.camera_status || "Unknown"}
                    </span>

                  </div>

                  {/* PROPERTY */}
                  <p className="mb-2">
                    <FaBuilding className="me-2" />
                    <strong>Property:</strong>{" "}
                    {snapshot.property_name || "N/A"}
                  </p>

                  {/* LOCATION */}
                  <p className="mb-2">
                    <FaMapMarkerAlt className="me-2" />
                    <strong>Location:</strong>{" "}
                    {snapshot.camera_location || "N/A"}
                  </p>

                  {/* CAPTURED TIME */}
                  <p className="mb-2">
                    <FaClock className="me-2" />
                    <strong>Captured:</strong>{" "}
                    {formatDate(snapshot.captured_at)}
                  </p>

                  {/* REMARKS */}
                  {snapshot.remarks && (
                    <p className="text-muted small mb-0">
                      <strong>Remarks:</strong>{" "}
                      {snapshot.remarks}
                    </p>
                  )}

                </div>

                {/* ACTIONS */}
                <div className="card-footer bg-white border-0 pt-0 pb-3">

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-outline-dark flex-fill"
                      onClick={() =>
                        navigate(
                          `/admin/security/live-snapshots/view/${snapshot.id}`
                        )
                      }
                    >
                      <FaEye className="me-2" />
                      View
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() =>
                        handleDelete(snapshot.id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default LiveSnapshots;