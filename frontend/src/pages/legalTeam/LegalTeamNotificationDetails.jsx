
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaEnvelopeOpen,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamNotificationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [notification, setNotification] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH NOTIFICATION
  // =====================================================

  const fetchNotification = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setNotification(
          response.data.notification
        );
      } else {
        setError(
          response.data?.message ||
            "Failed to fetch notification."
        );
      }
    } catch (err) {
      console.error(
        "Notification Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load notification."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  // =====================================================
  // MARK AS READ
  // =====================================================

  const markAsRead = async () => {
    if (!notification || notification.is_read) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/legal-team/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setNotification(
          response.data.notification
        );
      } else {
        setError(
          response.data?.message ||
            "Failed to mark notification as read."
        );
      }
    } catch (err) {
      console.error(
        "Mark Notification Read Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to update notification."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 mb-0">
          Loading notification...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !notification) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={() =>
            navigate("/legal-team/notifications")
          }
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Notifications
        </button>

        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="text-center py-5">
        <FaBell
          style={{
            fontSize: "50px",
            color: "#CCCCCC",
          }}
        />

        <p className="mt-3 text-muted">
          Notification not found.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-4">
        <button
          type="button"
          className="btn mb-3"
          onClick={() =>
            navigate("/legal-team/notifications")
          }
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Notifications
        </button>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3
              className="mb-1"
              style={{
                fontWeight: "700",
                color: "#111111",
              }}
            >
              Notification Details
            </h3>

            <p
              className="mb-0"
              style={{
                color: "#777777",
              }}
            >
              View complete notification information.
            </p>
          </div>

          {!notification.is_read && (
            <button
              type="button"
              className="btn"
              onClick={markAsRead}
              disabled={actionLoading}
              style={{
                backgroundColor: "#198754",
                color: "#FFFFFF",
                border: "1px solid #198754",
              }}
            >
              <FaCheckCircle className="me-2" />

              {actionLoading
                ? "Updating..."
                : "Mark as Read"}
            </button>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* MAIN NOTIFICATION CARD */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header py-3"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            borderBottom:
              "2px solid #C9A227",
          }}
        >
          <div className="d-flex align-items-center">
            <FaBell
              style={{
                color: "#C9A227",
                fontSize: "22px",
                marginRight: "12px",
              }}
            />

            <strong>
              Notification
            </strong>
          </div>
        </div>

        <div className="card-body p-4">
          {/* TITLE */}

          <div className="mb-4">
            <small className="text-muted">
              Title
            </small>

            <h4
              className="mt-2 mb-0"
              style={{
                fontWeight: "700",
                color: "#111111",
              }}
            >
              {notification.title || "-"}
            </h4>
          </div>

          {/* MESSAGE */}

          <div className="mb-4">
            <small className="text-muted">
              Message
            </small>

            <div
              className="mt-2 p-4 rounded"
              style={{
                backgroundColor: "#F8F8F8",
                borderLeft:
                  "4px solid #C9A227",
                color: "#333333",
                lineHeight: "1.7",
              }}
            >
              {notification.message || "-"}
            </div>
          </div>

          {/* INFORMATION */}

          <div className="row g-4">
            <div className="col-md-4">
              <div>
                <small className="text-muted">
                  Notification ID
                </small>

                <div className="fw-semibold mt-1">
                  {notification.id}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div>
                <small className="text-muted">
                  Notification Type
                </small>

                <div className="mt-1">
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        "#F5E8B0",
                      color: "#111111",
                    }}
                  >
                    <FaTag className="me-1" />

                    {notification.notification_type ||
                      "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div>
                <small className="text-muted">
                  Status
                </small>

                <div className="mt-1">
                  {notification.is_read ? (
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          "#DFF5E3",
                        color: "#198754",
                      }}
                    >
                      <FaEnvelopeOpen className="me-1" />
                      Read
                    </span>
                  ) : (
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          "#F8D7DA",
                        color: "#842029",
                      }}
                    >
                      <FaBell className="me-1" />
                      Unread
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div>
                <small className="text-muted">
                  Created Date
                </small>

                <div className="fw-semibold mt-1">
                  <FaCalendarAlt
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {formatDate(
                    notification.created_at
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div>
                <small className="text-muted">
                  Created Time
                </small>

                <div className="fw-semibold mt-1">
                  {formatTime(
                    notification.created_at
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* USER INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div
          className="card-header py-3"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <strong>
            Notification Recipient
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted">
                User ID
              </small>

              <div className="fw-semibold mt-1">
                {notification.user_id || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Notification Type
              </small>

              <div className="fw-semibold mt-1">
                {notification.notification_type ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Current Status
              </small>

              <div className="mt-1">
                {notification.is_read
                  ? "Read"
                  : "Unread"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTeamNotificationDetails;

