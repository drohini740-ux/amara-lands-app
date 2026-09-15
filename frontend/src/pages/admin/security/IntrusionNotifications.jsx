import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiShield,
  FiXCircle,
} from "react-icons/fi";

import {
  fetchIntrusionNotifications,
  acknowledgeNotification,
  resolveNotification,
  removeIntrusionNotification,
} from "../../../redux/intrusionNotificationSlice";

const IntrusionNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    notifications = [],
    loading,
    error,
  } = useSelector((state) => state.intrusionNotifications || {});

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchIntrusionNotifications());
  }, [dispatch]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        String(notification.id || "").includes(searchText) ||
        String(notification.notification_type || "")
          .toLowerCase()
          .includes(searchText) ||
        String(notification.message || "")
          .toLowerCase()
          .includes(searchText) ||
        String(notification.camera_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(notification.property_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        notification.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        notification.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [notifications, search, severityFilter, statusFilter]);

  const totalCount = notifications.length;

  const newCount = notifications.filter(
    (item) => item.status === "New"
  ).length;

  const acknowledgedCount = notifications.filter(
    (item) => item.status === "Acknowledged"
  ).length;

  const resolvedCount = notifications.filter(
    (item) => item.status === "Resolved"
  ).length;

  const highCount = notifications.filter(
    (item) => item.severity === "High"
  ).length;

  const handleRefresh = () => {
    dispatch(fetchIntrusionNotifications());
  };

  const handleAcknowledge = async (id) => {
    try {
      await dispatch(acknowledgeNotification(id)).unwrap();
      dispatch(fetchIntrusionNotifications());
    } catch (err) {
      console.error("Acknowledge failed:", err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await dispatch(resolveNotification(id)).unwrap();
      dispatch(fetchIntrusionNotifications());
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this intrusion notification?"
    );

    if (!confirmed) return;

    try {
      await dispatch(removeIntrusionNotification(id)).unwrap();
      dispatch(fetchIntrusionNotifications());
    } catch (err) {
      console.error("Delete failed:", err);
    }
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

  return (
    <div className="intrusion-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div className="title-wrapper">

          <div className="title-icon-box">
            <FiShield />
          </div>

          <div>
            <h2>Intrusion Notifications</h2>

            <p>
              Monitor and manage security intrusion notifications
            </p>
          </div>

        </div>

        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "spin" : ""} />
          Refresh
        </button>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="error-box">
          <FiXCircle />
          <span>{error}</span>
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <div className="summary-grid">

        <div className="summary-card">

          <div className="summary-icon total">
            <FiShield />
          </div>

          <div>
            <span>Total Notifications</span>
            <strong>{totalCount}</strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon new">
            <FiAlertTriangle />
          </div>

          <div>
            <span>New</span>
            <strong>{newCount}</strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon acknowledged">
            <FiClock />
          </div>

          <div>
            <span>Acknowledged</span>
            <strong>{acknowledgedCount}</strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon resolved">
            <FiCheckCircle />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>

        </div>

        <div className="summary-card high-card">

          <div className="summary-icon high">
            <FiAlertTriangle />
          </div>

          <div>
            <span>High Severity</span>
            <strong>{highCount}</strong>
          </div>

        </div>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="filter-card">

        <div className="search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search notification, camera, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="All">All Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
        </select>

        <button
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setSeverityFilter("All");
            setStatusFilter("All");
          }}
        >
          Clear
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="table-card">

        <div className="table-header">

          <div>
            <div className="table-title-row">
              <span className="gold-line-title"></span>

              <div>
                <h3>Intrusion Alerts</h3>

                <span>
                  Showing {filteredNotifications.length} notification(s)
                </span>
              </div>
            </div>
          </div>

        </div>

        {loading ? (

          <div className="loading-box">
            <FiRefreshCw className="spin" />
            <span>Loading intrusion notifications...</span>
          </div>

        ) : filteredNotifications.length === 0 ? (

          <div className="empty-box">

            <FiShield />

            <h4>No Intrusion Notifications Found</h4>

            <p>
              There are no notifications matching your filters.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Notification</th>
                  <th>Camera</th>
                  <th>Property</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Detected At</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredNotifications.map((notification) => (

                  <tr key={notification.id}>

                    <td>
                      <strong className="notification-id">
                        #{notification.id}
                      </strong>
                    </td>

                    <td>

                      <div className="notification-cell">

                        <strong>
                          {notification.notification_type || "-"}
                        </strong>

                        <span>
                          {notification.message || "No message"}
                        </span>

                      </div>

                    </td>

                    <td>

                      <div className="camera-cell">

                        <strong>
                          {notification.camera_name ||
                            `Camera ${notification.camera_id}`}
                        </strong>

                        {notification.camera_location && (
                          <span>
                            {notification.camera_location}
                          </span>
                        )}

                      </div>

                    </td>

                    <td>
                      <span className="property-name">
                        {notification.property_name ||
                          `Property ${notification.property_id || "-"}`}
                      </span>
                    </td>

                    <td>

                      <span
                        className={`badge ${getSeverityClass(
                          notification.severity
                        )}`}
                      >
                        {notification.severity || "Medium"}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`badge ${getStatusClass(
                          notification.status
                        )}`}
                      >
                        {notification.status || "New"}
                      </span>

                    </td>

                    <td>
                      <span className="date-text">
                        {formatDate(notification.detected_at)}
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="action-btn view"
                          title="View"
                          onClick={() =>
                            navigate(
                              `/admin/security/intrusion-notifications/${notification.id}`
                            )
                          }
                        >
                          <FiEye />
                        </button>

                        {notification.status === "New" && (

                          <button
                            className="action-btn acknowledge"
                            title="Acknowledge"
                            onClick={() =>
                              handleAcknowledge(notification.id)
                            }
                          >
                            <FiClock />
                          </button>

                        )}

                        {notification.status !== "Resolved" && (

                          <button
                            className="action-btn resolve"
                            title="Resolve"
                            onClick={() =>
                              handleResolve(notification.id)
                            }
                          >
                            <FiCheckCircle />
                          </button>

                        )}

                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() =>
                            handleDelete(notification.id)
                          }
                        >
                          <FiTrash2 />
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

      {/* ================= GOLD / BLACK / WHITE THEME ================= */}

      <style>{`

        /* =====================================================
           AMARA LANDS
           BLACK + WHITE + GOLD THEME
        ===================================================== */

        .intrusion-page {
          padding: 26px;
          background: #f7f7f7;
          min-height: 100vh;
          color: #111111;
        }

        /* ================= HEADER ================= */

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title-icon-box {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #b8860b;
          color: #ffffff;

          border-radius: 7px;

          font-size: 25px;

          box-shadow:
            0 4px 10px rgba(184, 134, 11, 0.22);
        }

        .page-header h2 {
          margin: 0;

          font-size: 27px;
          font-weight: 700;

          color: #111111;
        }

        .page-header p {
          margin: 5px 0 0;

          color: #777777;

          font-size: 13px;
        }

        /* ================= REFRESH ================= */

        .refresh-btn {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border: none;

          background: #111111;
          color: #ffffff;

          padding: 11px 19px;

          border-radius: 6px;

          cursor: pointer;

          font-weight: 600;

          transition: all 0.2s ease;
        }

        .refresh-btn:hover {
          background: #b8860b;
          color: #ffffff;
        }

        .refresh-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ================= ERROR ================= */

        .error-box {
          background: #ffffff;

          color: #a00000;

          border: 1px solid #e1b6b6;
          border-left: 4px solid #a00000;

          padding: 13px 16px;

          border-radius: 6px;

          display: flex;
          align-items: center;

          gap: 9px;

          margin-bottom: 18px;
        }

        /* ================= SUMMARY ================= */

        .summary-grid {
          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 15px;

          margin-bottom: 22px;
        }

        .summary-card {
          position: relative;

          background: #ffffff;

          border: 1px solid #e2e2e2;

          border-radius: 8px;

          padding: 18px;

          display: flex;
          align-items: center;

          gap: 13px;

          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.04);

          overflow: hidden;
        }

        /* Gold left border */

        .summary-card::before {
          content: "";

          position: absolute;

          left: 0;
          top: 0;

          width: 3px;
          height: 100%;

          background: #b8860b;
        }

        .summary-icon {
          width: 44px;
          height: 44px;

          min-width: 44px;

          border-radius: 7px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 20px;
        }

        .summary-icon.total {
          background: #f4ecd5;
          color: #9a7100;
        }

        .summary-icon.new {
          background: #f4ecd5;
          color: #a67800;
        }

        .summary-icon.acknowledged {
          background: #eeeeee;
          color: #333333;
        }

        .summary-icon.resolved {
          background: #eeeeee;
          color: #333333;
        }

        .summary-icon.high {
          background: #f1e1e1;
          color: #9d2222;
        }

        .summary-card span {
          display: block;

          color: #777777;

          font-size: 11px;

          margin-bottom: 4px;
        }

        .summary-card strong {
          color: #111111;

          font-size: 24px;

          font-weight: 700;
        }

        /* ================= FILTER ================= */

        .filter-card {
          background: #ffffff;

          padding: 15px;

          border-radius: 8px;

          border: 1px solid #dedede;

          display: flex;

          gap: 11px;

          margin-bottom: 20px;

          box-shadow:
            0 2px 7px rgba(0, 0, 0, 0.03);
        }

        .search-box {
          flex: 1;

          display: flex;
          align-items: center;

          gap: 9px;

          border: 1px solid #d7d7d7;

          border-radius: 6px;

          padding: 0 12px;

          background: #ffffff;
        }

        .search-box:focus-within {
          border-color: #b8860b;

          box-shadow:
            0 0 0 2px rgba(184, 134, 11, 0.10);
        }

        .search-box svg {
          color: #b8860b;
        }

        .search-box input {
          width: 100%;

          border: none;
          outline: none;

          padding: 11px 4px;

          font-size: 13px;

          color: #111111;

          background: transparent;
        }

        .search-box input::placeholder {
          color: #999999;
        }

        .filter-card select {
          min-width: 150px;

          border: 1px solid #d7d7d7;

          border-radius: 6px;

          padding: 10px 12px;

          background: #ffffff;

          color: #222222;

          outline: none;

          cursor: pointer;
        }

        .filter-card select:focus {
          border-color: #b8860b;
        }

        .clear-btn {
          border: 1px solid #111111;

          background: #ffffff;

          color: #111111;

          padding: 0 19px;

          border-radius: 6px;

          cursor: pointer;

          font-weight: 600;

          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: #111111;
          color: #ffffff;
        }

        /* ================= TABLE CARD ================= */

        .table-card {
          background: #ffffff;

          border-radius: 8px;

          border: 1px solid #dedede;

          overflow: hidden;

          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .table-header {
          padding: 18px 20px;

          border-bottom: 1px solid #e6e6e6;

          background: #ffffff;
        }

        .table-title-row {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .gold-line-title {
          width: 4px;
          height: 38px;

          background: #b8860b;

          border-radius: 2px;
        }

        .table-header h3 {
          margin: 0 0 3px;

          color: #111111;

          font-size: 18px;

          font-weight: 700;
        }

        .table-header span {
          font-size: 12px;

          color: #777777;
        }

        /* ================= TABLE ================= */

        .table-responsive {
          overflow-x: auto;
        }

        table {
          width: 100%;

          border-collapse: collapse;

          min-width: 1150px;
        }

        th {
          background: #111111;

          color: #ffffff;

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: 0.5px;

          padding: 13px 14px;

          text-align: left;

          border-bottom: 2px solid #b8860b;
        }

        td {
          padding: 14px;

          border-bottom: 1px solid #eeeeee;

          color: #333333;

          font-size: 13px;

          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #fffdf7;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .notification-id {
          color: #b8860b;

          font-weight: 700;
        }

        .property-name {
          color: #222222;

          font-weight: 500;
        }

        .date-text {
          color: #555555;

          font-size: 12px;
        }

        /* ================= CELLS ================= */

        .notification-cell,
        .camera-cell {
          display: flex;

          flex-direction: column;

          gap: 4px;
        }

        .notification-cell strong,
        .camera-cell strong {
          color: #111111;

          font-weight: 600;
        }

        .notification-cell span,
        .camera-cell span {
          color: #888888;

          font-size: 11px;
        }

        /* ================= BADGES ================= */

        .badge {
          display: inline-block;

          padding: 5px 10px;

          border-radius: 3px;

          font-size: 10px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.3px;
        }

        .severity-high {
          background: #111111;

          color: #d9ad32;

          border: 1px solid #b8860b;
        }

        .severity-medium {
          background: #f4ecd5;

          color: #8a6500;

          border: 1px solid #dfc87e;
        }

        .severity-low {
          background: #eeeeee;

          color: #333333;

          border: 1px solid #d5d5d5;
        }

        .severity-default {
          background: #eeeeee;

          color: #555555;
        }

        .status-new {
          background: #111111;

          color: #d9ad32;

          border: 1px solid #b8860b;
        }

        .status-acknowledged {
          background: #eeeeee;

          color: #333333;

          border: 1px solid #d5d5d5;
        }

        .status-resolved {
          background: #f4ecd5;

          color: #775600;

          border: 1px solid #dfc87e;
        }

        .status-default {
          background: #eeeeee;

          color: #555555;
        }

        /* ================= ACTION BUTTONS ================= */

        .action-buttons {
          display: flex;

          gap: 6px;
        }

        .action-btn {
          width: 32px;
          height: 32px;

          border: 1px solid #dedede;

          border-radius: 5px;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          background: #ffffff;

          transition: all 0.2s ease;
        }

        .action-btn.view {
          color: #111111;
        }

        .action-btn.acknowledge {
          color: #a67800;
        }

        .action-btn.resolve {
          color: #111111;
        }

        .action-btn.delete {
          color: #8d1f1f;
        }

        .action-btn.view:hover {
          background: #111111;
          color: #ffffff;

          border-color: #111111;
        }

        .action-btn.acknowledge:hover {
          background: #b8860b;
          color: #ffffff;

          border-color: #b8860b;
        }

        .action-btn.resolve:hover {
          background: #b8860b;
          color: #ffffff;

          border-color: #b8860b;
        }

        .action-btn.delete:hover {
          background: #111111;
          color: #ffffff;

          border-color: #111111;
        }

        /* ================= LOADING ================= */

        .loading-box,
        .empty-box {
          min-height: 260px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #777777;

          gap: 10px;
        }

        .loading-box svg {
          font-size: 30px;

          color: #b8860b;
        }

        .empty-box svg {
          font-size: 45px;

          color: #b8860b;
        }

        .empty-box h4 {
          margin: 0;

          color: #111111;

          font-size: 16px;
        }

        .empty-box p {
          margin: 0;

          font-size: 13px;

          color: #888888;
        }

        /* ================= ANIMATION ================= */

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .intrusion-page {
            padding: 14px;
          }

          .page-header {
            align-items: flex-start;

            gap: 15px;

            flex-direction: column;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .filter-card {
            flex-direction: column;
          }

          .filter-card select,
          .clear-btn {
            width: 100%;

            min-height: 42px;
          }

          .refresh-btn {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
};

export default IntrusionNotifications;