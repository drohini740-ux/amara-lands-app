import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiTrash2,
  FiAlertTriangle,
  FiCalendar,
  FiLink,
} from "react-icons/fi";

import {
  fetchIntrusionNotification,
  acknowledgeNotification,
  resolveNotification,
  removeIntrusionNotification,
} from "../../../redux/intrusionNotificationSlice";

const IntrusionNotificationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedNotification,
    loading,
    error,
  } = useSelector(
    (state) => state.intrusionNotifications || {}
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchIntrusionNotification(id));
    }
  }, [dispatch, id]);

  const notification = selectedNotification;

  const handleAcknowledge = async () => {
    try {
      await dispatch(acknowledgeNotification(id)).unwrap();
      dispatch(fetchIntrusionNotification(id));
    } catch (err) {
      console.error("Acknowledge failed:", err);
    }
  };

  const handleResolve = async () => {
    try {
      await dispatch(resolveNotification(id)).unwrap();
      dispatch(fetchIntrusionNotification(id));
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this intrusion notification?"
    );

    if (!confirmed) return;

    try {
      await dispatch(removeIntrusionNotification(id)).unwrap();

      navigate("/admin/security/intrusion-notifications");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "High":
        return "severity-high";

      case "Medium":
        return "severity-medium";

      case "Low":
        return "severity-low";

      default:
        return "severity-default";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "status-new";

      case "Acknowledged":
        return "status-acknowledged";

      case "Resolved":
        return "status-resolved";

      default:
        return "status-default";
    }
  };

  if (loading && !notification) {
    return (
      <div className="intrusion-loading">
        <div className="loading-shield">
          <FiShield />
        </div>

        <h3>Loading Notification</h3>
        <p>Please wait...</p>

        <style>{`
          .intrusion-loading {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #f8f8f8;
          }

          .loading-shield {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: #c69214;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin-bottom: 15px;
            animation: goldPulse 1.5s infinite;
          }

          .intrusion-loading h3 {
            color: #111;
            margin: 0 0 5px;
          }

          .intrusion-loading p {
            color: #777;
            margin: 0;
          }

          @keyframes goldPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(198, 146, 20, 0.5);
            }

            70% {
              box-shadow: 0 0 0 15px rgba(198, 146, 20, 0);
            }

            100% {
              box-shadow: 0 0 0 0 rgba(198, 146, 20, 0);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error && !notification) {
    return (
      <div className="intrusion-error">
        <FiAlertTriangle />

        <h3>Unable to Load Notification</h3>

        <p>{error}</p>

        <button
          onClick={() =>
            navigate("/admin/security/intrusion-notifications")
          }
        >
          <FiArrowLeft />
          Back to Notifications
        </button>

        <style>{`
          .intrusion-error {
            min-height: 70vh;
            background: #f8f8f8;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .intrusion-error > svg {
            font-size: 48px;
            color: #c69214;
          }

          .intrusion-error h3 {
            color: #111;
            margin: 15px 0 5px;
          }

          .intrusion-error p {
            color: #777;
            margin-bottom: 20px;
          }

          .intrusion-error button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: none;
            background: #111;
            color: #fff;
            padding: 11px 18px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }

          .intrusion-error button:hover {
            background: #c69214;
          }
        `}</style>
      </div>
    );
  }

  if (!notification) {
    return null;
  }

  return (
    <div className="intrusion-view-page">

      {/* ================= HEADER ================= */}

      <div className="intrusion-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() =>
              navigate("/admin/security/intrusion-notifications")
            }
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="page-title">

            <div className="title-shield">
              <FiShield />
            </div>

            <div>
              <h1>Intrusion Notification</h1>

              <p>
                Security notification #{notification.id}
              </p>
            </div>

          </div>

        </div>

        <div className="header-actions">

          {notification.status === "New" && (
            <button
              className="action-button acknowledge"
              onClick={handleAcknowledge}
              disabled={loading}
            >
              <FiClock />
              Acknowledge
            </button>
          )}

          {notification.status !== "Resolved" && (
            <button
              className="action-button resolve"
              onClick={handleResolve}
              disabled={loading}
            >
              <FiCheckCircle />
              Resolve
            </button>
          )}

          <button
            className="action-button delete"
            onClick={handleDelete}
            disabled={loading}
          >
            <FiTrash2 />
            Delete
          </button>

        </div>

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="main-grid">

        {/* ================= NOTIFICATION DETAILS ================= */}

        <div className="gold-card notification-card">

          <div className="card-header">

            <div className="card-header-icon">
              <FiAlertTriangle />
            </div>

            <div>
              <h2>Notification Details</h2>
              <span>Intrusion event information</span>
            </div>

          </div>

          <div className="gold-line"></div>

          <div className="details-grid">

            <div className="detail-item">
              <label>Notification ID</label>
              <strong>
                #{notification.id}
              </strong>
            </div>

            <div className="detail-item">
              <label>Notification Type</label>
              <strong>
                {notification.notification_type || "-"}
              </strong>
            </div>

            <div className="detail-item">
              <label>Severity</label>

              <span
                className={`badge ${getSeverityClass(
                  notification.severity
                )}`}
              >
                {notification.severity || "Medium"}
              </span>
            </div>

            <div className="detail-item">
              <label>Status</label>

              <span
                className={`badge ${getStatusClass(
                  notification.status
                )}`}
              >
                {notification.status || "New"}
              </span>
            </div>

            <div className="detail-item full-width">

              <label>Message</label>

              <div className="message-box">
                <FiAlertTriangle />

                <span>
                  {notification.message ||
                    "No message available"}
                </span>
              </div>

            </div>

            <div className="detail-item">

              <label>Detected At</label>

              <strong className="date-value">
                <FiCalendar />
                {formatDate(notification.detected_at)}
              </strong>

            </div>

            <div className="detail-item">

              <label>Created At</label>

              <strong className="date-value">
                <FiCalendar />
                {formatDate(notification.created_at)}
              </strong>

            </div>

          </div>

        </div>

        {/* ================= CAMERA DETAILS ================= */}

        <div className="gold-card">

          <div className="card-header">

            <div className="card-header-icon">
              <FiCamera />
            </div>

            <div>
              <h2>Camera Details</h2>
              <span>Source of intrusion alert</span>
            </div>

          </div>

          <div className="gold-line"></div>

          <div className="camera-profile">

            <div className="camera-icon">
              <FiCamera />
            </div>

            <div>
              <label>Camera</label>

              <strong>
                {notification.camera_name ||
                  `Camera ${notification.camera_id}`}
              </strong>
            </div>

          </div>

          <div className="info-row">

            <span>Camera ID</span>

            <strong>
              {notification.camera_id || "-"}
            </strong>

          </div>

          <div className="info-row">

            <span>Location</span>

            <strong>
              <FiMapPin />

              {notification.camera_location || "-"}
            </strong>

          </div>

          <div className="info-row">

            <span>Camera Type</span>

            <strong>
              {notification.camera_type || "-"}
            </strong>

          </div>

          <div className="info-row">

            <span>Camera Status</span>

            <strong className="active-status">
              <span className="active-dot"></span>
              {notification.camera_status || "Active"}
            </strong>

          </div>

        </div>

        {/* ================= PROPERTY DETAILS ================= */}

        <div className="gold-card property-card">

          <div className="card-header">

            <div className="card-header-icon">
              <FiMapPin />
            </div>

            <div>
              <h2>Property Details</h2>
              <span>Property linked to this alert</span>
            </div>

          </div>

          <div className="gold-line"></div>

          <div className="property-content">

            <h3>
              {notification.property_name ||
                `Property ${notification.property_id || "-"}`}
            </h3>

            <div className="property-id">
              <span>Property ID</span>

              <strong>
                {notification.property_id || "-"}
              </strong>
            </div>

          </div>

        </div>

        {/* ================= SNAPSHOT ================= */}

        <div className="gold-card snapshot-card">

          <div className="card-header">

            <div className="card-header-icon">
              <FiCamera />
            </div>

            <div>
              <h2>Intrusion Snapshot</h2>
              <span>Captured security image</span>
            </div>

          </div>

          <div className="gold-line"></div>

          {notification.snapshot_url ? (

            <div className="snapshot-wrapper">

              <img
                src={notification.snapshot_url}
                alt="Intrusion snapshot"
                className="snapshot-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="snapshot-url">

                <FiLink />

                <span>
                  {notification.snapshot_url}
                </span>

              </div>

            </div>

          ) : (

            <div className="no-snapshot">

              <FiCamera />

              <h4>No Snapshot Available</h4>

              <p>
                No image was attached to this intrusion
                notification.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================= STYLES ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .intrusion-view-page {
          min-height: 100vh;
          background: #f6f6f6;
          padding: 25px;
          color: #111;
        }

        /* ================= HEADER ================= */

        .intrusion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 11px 16px;

          border: 1px solid #d5d5d5;
          border-radius: 6px;

          background: #fff;
          color: #111;

          cursor: pointer;
          font-weight: 600;

          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .title-shield {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #c69214;
          color: #fff;

          font-size: 25px;

          box-shadow: 0 4px 12px rgba(198, 146, 20, 0.25);
        }

        .page-title h1 {
          margin: 0;

          color: #111;

          font-size: 27px;
          font-weight: 700;
        }

        .page-title p {
          margin: 4px 0 0;

          color: #777;

          font-size: 13px;
        }

        /* ================= ACTION BUTTONS ================= */

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;

          border: none;

          padding: 11px 17px;

          border-radius: 6px;

          color: #fff;

          font-weight: 600;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-button.acknowledge {
          background: #c69214;
        }

        .action-button.acknowledge:hover {
          background: #a8790e;
        }

        .action-button.resolve {
          background: #111;
        }

        .action-button.resolve:hover {
          background: #333;
        }

        .action-button.delete {
          background: #111;
        }

        .action-button.delete:hover {
          background: #c69214;
        }

        /* ================= MAIN GRID ================= */

        .main-grid {
          display: grid;

          grid-template-columns: 1.8fr 1fr;

          gap: 18px;
        }

        /* ================= CARD ================= */

        .gold-card {
          background: #fff;

          border: 1px solid #e4e4e4;

          border-radius: 9px;

          padding: 21px;

          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.04);

          position: relative;

          overflow: hidden;
        }

        .gold-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;

          width: 4px;
          height: 100%;

          background: #c69214;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .card-header-icon {
          width: 39px;
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 7px;

          background: #f7edd3;

          color: #a8790e;

          font-size: 19px;
        }

        .card-header h2 {
          margin: 0;

          color: #111;

          font-size: 17px;
          font-weight: 700;
        }

        .card-header span {
          display: block;

          margin-top: 3px;

          color: #888;

          font-size: 11px;
        }

        .gold-line {
          height: 1px;

          background: #eadfbf;

          margin: 17px 0;
        }

        /* ================= DETAILS ================= */

        .details-grid {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 21px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          color: #8a8a8a;

          font-size: 11px;

          font-weight: 500;

          text-transform: uppercase;

          letter-spacing: 0.3px;
        }

        .detail-item strong {
          color: #111;

          font-size: 14px;
        }

        /* ================= MESSAGE ================= */

        .message-box {
          display: flex;

          align-items: center;

          gap: 10px;

          background: #fafafa;

          border: 1px solid #e7e7e7;

          border-left: 3px solid #c69214;

          border-radius: 6px;

          padding: 13px;

          color: #333;

          font-size: 13px;

          line-height: 1.5;
        }

        .message-box svg {
          color: #c69214;

          flex-shrink: 0;
        }

        /* ================= BADGES ================= */

        .badge {
          width: fit-content;

          padding: 5px 11px;

          border-radius: 20px;

          font-size: 11px;

          font-weight: 700;
        }

        .severity-high {
          background: #ffe4e4;
          color: #c62828;
        }

        .severity-medium {
          background: #fff1d2;
          color: #a56a00;
        }

        .severity-low {
          background: #e8f5e9;
          color: #287a32;
        }

        .severity-default {
          background: #eee;
          color: #555;
        }

        .status-new {
          background: #fff1d2;
          color: #a56a00;
        }

        .status-acknowledged {
          background: #f0e5c2;
          color: #795900;
        }

        .status-resolved {
          background: #e8f5e9;
          color: #287a32;
        }

        .status-default {
          background: #eee;
          color: #555;
        }

        /* ================= DATE ================= */

        .date-value {
          display: flex;

          align-items: center;

          gap: 7px;
        }

        .date-value svg {
          color: #c69214;
        }

        /* ================= CAMERA ================= */

        .camera-profile {
          display: flex;

          align-items: center;

          gap: 13px;

          padding-bottom: 16px;

          border-bottom: 1px solid #eee;

          margin-bottom: 4px;
        }

        .camera-icon {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: #f7edd3;

          color: #a8790e;

          border-radius: 8px;

          font-size: 23px;
        }

        .camera-profile label {
          display: block;

          color: #888;

          font-size: 11px;

          margin-bottom: 3px;
        }

        .camera-profile strong {
          color: #111;

          font-size: 15px;
        }

        .info-row {
          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 15px;

          padding: 12px 0;

          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row > span {
          color: #888;

          font-size: 12px;
        }

        .info-row strong {
          display: flex;

          align-items: center;

          gap: 5px;

          color: #222;

          font-size: 13px;

          text-align: right;
        }

        .info-row strong svg {
          color: #c69214;
        }

        .active-status {
          color: #277a32 !important;
        }

        .active-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #29933a;

          display: inline-block;
        }

        /* ================= PROPERTY ================= */

        .property-content h3 {
          margin: 5px 0 20px;

          color: #111;

          font-size: 21px;
        }

        .property-id {
          display: flex;

          justify-content: space-between;

          border-top: 1px solid #eee;

          padding-top: 14px;
        }

        .property-id span {
          color: #888;

          font-size: 12px;
        }

        .property-id strong {
          color: #111;

          font-size: 13px;
        }

        /* ================= SNAPSHOT ================= */

        .snapshot-wrapper {
          width: 100%;
        }

        .snapshot-image {
          display: block;

          width: 100%;

          max-height: 420px;

          object-fit: contain;

          border-radius: 7px;

          border: 1px solid #ddd;

          background: #111;
        }

        .snapshot-url {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-top: 10px;

          padding: 10px;

          background: #fafafa;

          border-radius: 5px;

          color: #9b6c00;

          font-size: 11px;

          word-break: break-all;
        }

        .snapshot-url svg {
          flex-shrink: 0;

          color: #c69214;
        }

        .no-snapshot {
          min-height: 180px;

          display: flex;

          flex-direction: column;

          justify-content: center;

          align-items: center;

          text-align: center;

          color: #999;
        }

        .no-snapshot svg {
          font-size: 42px;

          color: #c69214;

          margin-bottom: 8px;
        }

        .no-snapshot h4 {
          margin: 0 0 5px;

          color: #333;
        }

        .no-snapshot p {
          margin: 0;

          font-size: 12px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1050px) {

          .main-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 800px) {

          .intrusion-header {
            flex-direction: column;

            align-items: flex-start;
          }

          .header-actions {
            width: 100%;

            flex-wrap: wrap;
          }

        }

        @media (max-width: 650px) {

          .intrusion-view-page {
            padding: 15px;
          }

          .header-left {
            align-items: flex-start;

            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: auto;
          }

          .page-title h1 {
            font-size: 22px;
          }

          .action-button {
            flex: 1;

            justify-content: center;
          }

        }

      `}</style>

    </div>
  );
};

export default IntrusionNotificationView;