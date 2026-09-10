import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaCamera,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaSyncAlt,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

import {
  fetchMotionDetectionAlerts,
  removeMotionDetectionAlert,
  acknowledgeMotionAlert,
  resolveMotionAlert,
} from "../../../redux/motionDetectionAlertSlice";

export default function MotionDetectionAlertView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    alerts = [],
    loading,
    error,
  } = useSelector((state) => state.motionDetectionAlerts);

  const [alertData, setAlertData] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  // ==========================================
  // Find Alert
  // ==========================================
  useEffect(() => {
    if (!alerts.length) {
      dispatch(fetchMotionDetectionAlerts());
    }
  }, [dispatch, alerts.length]);

  useEffect(() => {
    if (alerts.length && id) {
      const selectedAlert = alerts.find(
        (alert) => String(alert.id) === String(id),
      );

      setAlertData(selectedAlert || null);
    }
  }, [alerts, id]);

  // ==========================================
  // Refresh
  // ==========================================
  const handleRefresh = async () => {
    await dispatch(fetchMotionDetectionAlerts());
  };

  // ==========================================
  // Delete
  // ==========================================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this motion detection alert?",
    );

    if (!confirmed) return;

    try {
      await dispatch(removeMotionDetectionAlert(alertData.id)).unwrap();

      alert("Motion Detection Alert Deleted Successfully");

      navigate("/admin/security/motion-alerts");
    } catch (error) {
      console.error(error);
      alert("Failed to delete motion detection alert");
    }
  };
  // ==========================================
  // Acknowledge Alert
  // ==========================================
  const handleAcknowledge = async () => {
    if (!alertData?.id) return;

    try {
      setStatusUpdating(true);

      const result = await dispatch(
        acknowledgeMotionAlert(alertData.id),
      ).unwrap();

      if (result?.alert) {
        setAlertData((prev) => ({
          ...prev,
          ...result.alert,
        }));
      }

      alert("Motion Detection Alert Acknowledged Successfully");
    } catch (error) {
      console.error("Acknowledge Error:", error);

      alert(error || "Failed to acknowledge motion detection alert");
    } finally {
      setStatusUpdating(false);
    }
  };
  // ==========================================
  // Resolve Alert
  // ==========================================
  const handleResolve = async () => {
    if (!alertData?.id) return;

    try {
      setStatusUpdating(true);

      const result = await dispatch(resolveMotionAlert(alertData.id)).unwrap();

      if (result?.alert) {
        setAlertData((prev) => ({
          ...prev,
          ...result.alert,
        }));
      }

      alert("Motion Detection Alert Resolved Successfully");
    } catch (error) {
      console.error("Resolve Error:", error);

      alert(error || "Failed to resolve motion detection alert");
    } finally {
      setStatusUpdating(false);
    }
  };

  // ==========================================
  // Status Badge
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return <span className="badge bg-danger fs-6 px-3 py-2">New</span>;

      case "Acknowledged":
        return (
          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
            Acknowledged
          </span>
        );

      case "Resolved":
        return (
          <span className="badge bg-success fs-6 px-3 py-2">Resolved</span>
        );

      default:
        return (
          <span className="badge bg-secondary fs-6 px-3 py-2">
            {status || "Unknown"}
          </span>
        );
    }
  };

  // ==========================================
  // Severity Badge
  // ==========================================
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "High":
        return <span className="badge bg-danger fs-6 px-3 py-2">High</span>;

      case "Medium":
        return (
          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
            Medium
          </span>
        );

      case "Low":
        return <span className="badge bg-success fs-6 px-3 py-2">Low</span>;

      default:
        return (
          <span className="badge bg-secondary fs-6 px-3 py-2">
            {severity || "Unknown"}
          </span>
        );
    }
  };

  // ==========================================
  // Date Format
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading && !alertData) {
    return (
      <div
        className="container-fluid p-4"
        style={{
          background: "#f7f7f7",
          minHeight: "100vh",
        }}
      >
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "#fdbb05" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="text-muted mt-3">Loading motion detection alert...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
  if (error && !alertData) {
    return (
      <div
        className="container-fluid p-4"
        style={{
          background: "#f7f7f7",
          minHeight: "100vh",
        }}
      >
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate("/admin/security/motion-alerts")}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>

        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // ==========================================
  // Alert Not Found
  // ==========================================
  if (!alertData) {
    return (
      <div
        className="container-fluid p-4"
        style={{
          background: "#f7f7f7",
          minHeight: "100vh",
        }}
      >
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate("/admin/security/motion-alerts")}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaExclamationTriangle size={50} className="text-danger mb-3" />

            <h4 className="fw-bold">Motion Detection Alert Not Found</h4>

            <p className="text-muted">
              The requested alert could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/admin/security/motion-alerts")}
          >
            <FaArrowLeft className="me-2" />
            Back to Alerts
          </button>

          <h2 className="fw-bold mb-1">
            <FaExclamationTriangle className="me-2 text-danger" />
            Motion Detection Alert
          </h2>

          <p className="text-muted mb-0">
            View detailed information about this motion detection alert.
          </p>
        </div>

        <button
          className="btn btn-warning"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaSyncAlt className={loading ? "fa-spin me-2" : "me-2"} />
          Refresh
        </button>
      </div>

      {/* ======================================
          ALERT HEADER CARD
      ======================================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header"
          style={{
            background: "#111",
            color: "#fff",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Alert #{alertData.id}</h5>

              <small className="text-light">Motion Detection Alert</small>
            </div>

            <div className="d-flex gap-2">
              {getSeverityBadge(alertData.severity)}

              {getStatusBadge(alertData.status)}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Alert Type */}
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                }}
              >
                <small className="text-muted">Alert Type</small>

                <h5 className="fw-bold mb-0 mt-1">
                  {alertData.alert_type || "-"}
                </h5>
              </div>
            </div>

            {/* Detected At */}
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                }}
              >
                <small className="text-muted">Detected At</small>

                <h5 className="fw-bold mb-0 mt-1">
                  <FaCalendarAlt className="me-2 text-warning" />
                  {formatDate(alertData.detected_at)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          PROPERTY + CAMERA
      ======================================= */}
      <div className="row mb-4">
        {/* Property */}
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header fw-bold"
              style={{
                background: "#e0ad2f",
                color: "#111",
              }}
            >
              <FaMapMarkerAlt className="me-2" />
              Property Information
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Property ID</small>

                <h6 className="fw-bold">#{alertData.property_id || "-"}</h6>
              </div>

              <div>
                <small className="text-muted">Property Name</small>

                <h5 className="fw-bold">
                  {alertData.property_name ||
                    `Property #${alertData.property_id}`}
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Camera */}
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header fw-bold"
              style={{
                background: "#e0ad2f",
                color: "#111",
              }}
            >
              <FaCamera className="me-2" />
              Camera Information
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Camera ID</small>

                <h6 className="fw-bold">#{alertData.camera_id || "-"}</h6>
              </div>

              <div className="mb-3">
                <small className="text-muted">Camera Name</small>

                <h5 className="fw-bold">
                  {alertData.camera_name || `Camera #${alertData.camera_id}`}
                </h5>
              </div>

              <div className="mb-3">
                <small className="text-muted">Camera Location</small>

                <p className="mb-0">{alertData.camera_location || "-"}</p>
              </div>

              <div>
                <small className="text-muted">Camera Type</small>

                <p className="fw-semibold mb-0">
                  {alertData.camera_type || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          ALERT DETAILS
      ======================================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header fw-bold"
          style={{
            background: "#111",
            color: "#fff",
          }}
        >
          <FaShieldAlt className="me-2 text-warning" />
          Alert Details
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <small className="text-muted">Alert ID</small>

              <h6 className="fw-bold">#{alertData.id}</h6>
            </div>

            <div className="col-md-4 mb-3">
              <small className="text-muted">Severity</small>

              <div className="mt-1">{getSeverityBadge(alertData.severity)}</div>
            </div>

            <div className="col-md-4 mb-3">
              <small className="text-muted">Status</small>

              <div className="mt-1">{getStatusBadge(alertData.status)}</div>
            </div>

            <div className="col-md-4 mb-3">
              <small className="text-muted">Property ID</small>

              <h6 className="fw-bold">#{alertData.property_id || "-"}</h6>
            </div>

            <div className="col-md-4 mb-3">
              <small className="text-muted">Camera ID</small>

              <h6 className="fw-bold">#{alertData.camera_id || "-"}</h6>
            </div>

            <div className="col-md-4 mb-3">
              <small className="text-muted">Alert Type</small>

              <h6 className="fw-bold">{alertData.alert_type || "-"}</h6>
            </div>
          </div>

          {/* Optional Description */}
          {(alertData.description ||
            alertData.message ||
            alertData.details) && (
            <div className="mt-3 pt-3 border-top">
              <small className="text-muted">Description</small>

              <p className="mb-0 mt-1">
                {alertData.description ||
                  alertData.message ||
                  alertData.details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================
          ACTIONS
      ======================================= */}
      <div className="card border-0 shadow-sm">
        <div
          className="card-header fw-bold"
          style={{
            background: "#e0ad2f",
            color: "#111",
          }}
        >
          Alert Actions
        </div>

        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {/* Acknowledge */}
            {alertData.status === "New" && (
              <button
                className="btn btn-warning"
                onClick={handleAcknowledge}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Acknowledge
                  </>
                )}
              </button>
            )}

            {/* Resolve */}
            {alertData.status === "Acknowledged" && (
              <button
                className="btn btn-success"
                onClick={handleResolve}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Resolve
                  </>
                )}
              </button>
            )}

            {/* Delete */}
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              <FaTrash className="me-2" />
              Delete Alert
            </button>

            {/* Back */}
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/security/motion-alerts")}
            >
              <FaArrowLeft className="me-2" />
              Back to Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
