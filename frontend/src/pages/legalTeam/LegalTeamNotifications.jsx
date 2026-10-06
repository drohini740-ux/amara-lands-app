
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaEye,
  FaSync,
  FaCheckCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        setNotifications([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/legal-team/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "LEGAL TEAM NOTIFICATIONS RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        const notificationData =
          response.data.notifications ||
          response.data.data ||
          [];

        console.log(
          "LEGAL TEAM NOTIFICATIONS ARRAY:",
          notificationData
        );

        setNotifications(
          Array.isArray(notificationData)
            ? notificationData
            : []
        );
      } else {
        setNotifications([]);

        setError(
          response.data?.message ||
            "Failed to fetch notifications."
        );
      }
    } catch (err) {
      console.error(
        "LEGAL TEAM NOTIFICATIONS ERROR:",
        err.response?.data || err.message
      );

      setNotifications([]);

      setError(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================================
  // NOTIFICATION TYPES
  // =====================================================

  const notificationTypes = useMemo(() => {
    return [
      ...new Set(
        notifications
          .map(
            (notification) =>
              notification.notification_type
          )
          .filter(Boolean)
      ),
    ];
  }, [notifications]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        notification.is_read === false
    ).length;

  const readNotifications =
    notifications.filter(
      (notification) =>
        notification.is_read === true
    ).length;

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications =
    notifications.filter((notification) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        String(
          notification.title || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          notification.message || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          notification.notification_type || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesRead =
        readFilter === "all" ||
        (readFilter === "unread" &&
          notification.is_read === false) ||
        (readFilter === "read" &&
          notification.is_read === true);

      const matchesType =
        typeFilter === "all" ||
        String(
          notification.notification_type || ""
        ).toLowerCase() ===
          typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRead &&
        matchesType
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // MARK AS READ
  // =====================================================

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/legal-team/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchNotifications();
    } catch (err) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  // =====================================================
  // VIEW NOTIFICATION
  // =====================================================

  const handleView = (id) => {
    navigate(
      `/legal-team/notifications/view/${id}`
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Notifications
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View important updates and
            notifications for the Legal Team.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchNotifications}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total Notifications
                </small>

                <h3 className="mb-0 mt-2">
                  {totalNotifications}
                </h3>
              </div>

              <FaBell
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* UNREAD */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Unread
                </small>

                <h3 className="mb-0 mt-2">
                  {unreadNotifications}
                </h3>
              </div>

              <FaBell
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* READ */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Read
                </small>

                <h3 className="mb-0 mt-2">
                  {readNotifications}
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color: "#C9A227",
                    }}
                  />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* READ FILTER */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={readFilter}
                onChange={(e) =>
                  setReadFilter(e.target.value)
                }
              >
                <option value="all">
                  All Notifications
                </option>

                <option value="unread">
                  Unread
                </option>

                <option value="read">
                  Read
                </option>
              </select>
            </div>

            {/* TYPE FILTER */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
              >
                <option value="all">
                  All Types
                </option>

                {notificationTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
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
      {/* NOTIFICATION TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Notification History
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredNotifications.length}{" "}
              notifications
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length ===
            0 ? (
            <div className="text-center py-5">
              <FaBell
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No notifications found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Notification
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotifications.map(
                    (notification) => (
                      <tr
                        key={
                          notification.id
                        }
                        style={{
                          backgroundColor:
                            notification.is_read
                              ? "#FFFFFF"
                              : "#FFFDF3",
                        }}
                      >
                        <td className="px-3">
                          {notification.id}
                        </td>

                        <td>
                          <div>
                            <strong>
                              {notification.title ||
                                "Notification"}
                            </strong>

                            <div
                              style={{
                                maxWidth:
                                  "400px",
                                color:
                                  "#777777",
                                fontSize:
                                  "13px",
                                whiteSpace:
                                  "nowrap",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                              }}
                            >
                              {notification.message ||
                                "-"}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#F5E8B0",
                              color:
                                "#111111",
                            }}
                          >
                            {notification.notification_type ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          {notification.is_read ? (
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#DFF5E3",
                                color:
                                  "#198754",
                              }}
                            >
                              Read
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#F8D7DA",
                                color:
                                  "#842029",
                              }}
                            >
                              Unread
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            notification.created_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Notification"
                              onClick={() =>
                                handleView(
                                  notification.id
                                )
                              }
                              style={{
                                color:
                                  "#C9A227",
                                border:
                                  "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            {/* MARK AS READ */}

                            {!notification.is_read && (
                              <button
                                type="button"
                                className="btn btn-sm"
                                title="Mark as Read"
                                onClick={() =>
                                  handleMarkAsRead(
                                    notification.id
                                  )
                                }
                                style={{
                                  color:
                                    "#198754",
                                  border:
                                    "1px solid #198754",
                                }}
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalTeamNotifications;

