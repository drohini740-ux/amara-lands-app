import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaExclamationTriangle,
  FaSearch,
  FaEye,
  FaTrash,
  FaSyncAlt,
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import {
  fetchMotionDetectionAlerts,
  removeMotionDetectionAlert,
} from "../../../redux/motionDetectionAlertSlice";

export default function MotionDetectionAlerts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    alerts = [],
    loading,
    error,
  } = useSelector((state) => state.motionDetectionAlerts);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // Fetch Alerts
  // ==========================================
  useEffect(() => {
    dispatch(fetchMotionDetectionAlerts());
  }, [dispatch]);

  // ==========================================
  // Refresh
  // ==========================================
  const handleRefresh = () => {
    dispatch(fetchMotionDetectionAlerts());
  };

  // ==========================================
  // Delete
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this motion detection alert?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await dispatch(removeMotionDetectionAlert(id)).unwrap();

      alert("Motion Detection Alert Deleted Successfully");
    } catch (error) {
      console.error("Delete Motion Alert Error:", error);

      alert(
        error || "Failed to delete motion detection alert"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // Search + Filters
  // ==========================================
  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      String(alert.id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(alert.alert_type || "")
        .toLowerCase()
        .includes(searchText) ||
      String(alert.camera_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(alert.property_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(alert.severity || "")
        .toLowerCase()
        .includes(searchText) ||
      String(alert.status || "")
        .toLowerCase()
        .includes(searchText);

    const matchesSeverity =
      severityFilter === "All" ||
      alert.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      alert.status === statusFilter;

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus
    );
  });

  // ==========================================
  // Severity Badge
  // ==========================================
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "High":
        return (
          <span className="badge bg-danger">
            High
          </span>
        );

      case "Medium":
        return (
          <span className="badge bg-warning text-dark">
            Medium
          </span>
        );

      case "Low":
        return (
          <span className="badge bg-success">
            Low
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {severity || "Unknown"}
          </span>
        );
    }
  };

  // ==========================================
  // Status Badge
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="badge bg-danger">
            <FaBell className="me-1" />
            New
          </span>
        );

      case "Acknowledged":
        return (
          <span className="badge bg-warning text-dark">
            <FaClock className="me-1" />
            Acknowledged
          </span>
        );

      case "Resolved":
        return (
          <span className="badge bg-success">
            <FaCheckCircle className="me-1" />
            Resolved
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {status || "Unknown"}
          </span>
        );
    }
  };

  // ==========================================
  // Date Format
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "-";
    }

    return formattedDate.toLocaleString();
  };

  // ==========================================
  // Reset Filters
  // ==========================================
  const handleResetFilters = () => {
    setSearch("");
    setSeverityFilter("All");
    setStatusFilter("All");
  };

  // ==========================================
  // Summary Counts
  // ==========================================
  const totalAlerts = alerts.length;

  const newAlerts = alerts.filter(
    (alert) => alert.status === "New"
  ).length;

  const highSeverityAlerts = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  return (
    <div
      className="container-fluid p-4"
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      {/* ======================================
          HEADER
      ======================================= */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() =>
              navigate("/admin/security")
            }
          >
            <FaArrowLeft className="me-2" />
            Back
          </button>

          <h2 className="fw-bold mb-1">
            <FaExclamationTriangle className="me-2 text-danger" />
            Motion Detection Alerts
          </h2>

          <p className="text-muted mb-0">
            Monitor and manage motion detection alerts
            from surveillance cameras.
          </p>
        </div>

        <button
          className="btn btn-warning"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "fa-spin me-2"
                : "me-2"
            }
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ======================================
          ERROR
      ======================================= */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleRefresh}
          >
            Retry
          </button>
        </div>
      )}

      {/* ======================================
          SUMMARY CARDS
      ======================================= */}
      <div className="row mb-4">
        {/* Total */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Total Alerts
                  </p>

                  <h3 className="fw-bold mb-0">
                    {totalAlerts}
                  </h3>
                </div>

                <FaExclamationTriangle
                  size={28}
                  className="text-warning"
                />
              </div>
            </div>
          </div>
        </div>

        {/* New */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    New Alerts
                  </p>

                  <h3 className="fw-bold text-danger mb-0">
                    {newAlerts}
                  </h3>
                </div>

                <FaBell
                  size={28}
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>

        {/* High Severity */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    High Severity
                  </p>

                  <h3 className="fw-bold text-danger mb-0">
                    {highSeverityAlerts}
                  </h3>
                </div>

                <FaExclamationTriangle
                  size={28}
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Resolved
                  </p>

                  <h3 className="fw-bold text-success mb-0">
                    {resolvedAlerts}
                  </h3>
                </div>

                <FaCheckCircle
                  size={28}
                  className="text-success"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-5">
              <label className="form-label fw-semibold">
                Search
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search ID, alert, camera, property..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Severity */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Severity
              </label>

              <select
                className="form-select"
                value={severityFilter}
                onChange={(e) =>
                  setSeverityFilter(e.target.value)
                }
              >
                <option value="All">All Severities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Acknowledged">
                  Acknowledged
                </option>
                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>

            {/* Reset */}
            <div className="col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          ALERT TABLE
      ======================================= */}
      <div className="card border-0 shadow-sm">
        <div
          className="card-header"
          style={{
            background: "#111",
            color: "#fff",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Motion Detection Alerts
            </h5>

            <span className="badge bg-warning text-dark">
              {filteredAlerts.length} Alerts
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <div
                className="spinner-border text-warning"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-3 text-muted mb-0">
                Loading motion detection alerts...
              </p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center p-5">
              <FaExclamationTriangle
                size={45}
                className="text-muted mb-3"
              />

              <h5>
                {alerts.length === 0
                  ? "No Motion Detection Alerts"
                  : "No Matching Alerts"}
              </h5>

              <p className="text-muted mb-3">
                {alerts.length === 0
                  ? "No motion detection alerts are available."
                  : "Try changing your search or filters."}
              </p>

              {alerts.length > 0 && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Property</th>
                    <th>Camera</th>
                    <th>Alert Type</th>
                    <th>Severity</th>
                    <th>Detected At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id}>
                      {/* ID */}
                      <td>
                        <strong>
                          #{alert.id}
                        </strong>
                      </td>

                      {/* Property */}
                      <td>
                        <div className="fw-semibold">
                          {alert.property_name ||
                            `Property #${alert.property_id}`}
                        </div>
                      </td>

                      {/* Camera */}
                      <td>
                        <div>
                          {alert.camera_name ||
                            `Camera #${alert.camera_id}`}
                        </div>

                        {alert.camera_location && (
                          <small className="text-muted">
                            {alert.camera_location}
                          </small>
                        )}
                      </td>

                      {/* Alert Type */}
                      <td>
                        {alert.alert_type || "-"}
                      </td>

                      {/* Severity */}
                      <td>
                        {getSeverityBadge(
                          alert.severity
                        )}
                      </td>

                      {/* Detected */}
                      <td>
                        {formatDate(
                          alert.detected_at
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {getStatusBadge(
                          alert.status
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">
                          {/* View */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View Alert"
                            onClick={() =>
                              navigate(
                                `/admin/security/motion-alerts/view/${alert.id}`
                              )
                            }
                          >
                            <FaEye />
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Alert"
                            disabled={
                              deletingId === alert.id
                            }
                            onClick={() =>
                              handleDelete(alert.id)
                            }
                          >
                            {deletingId === alert.id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}