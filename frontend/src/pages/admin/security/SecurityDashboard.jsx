import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaCamera,
  FaExclamationTriangle,
  FaShieldAlt,
  FaUserShield,
  FaClipboardList,
  FaSyncAlt,
  FaArrowRight,
  FaBell,
} from "react-icons/fa";

import {
  fetchSecurityMonitoringDashboard,
} from "../../../redux/securityMonitoringDashboardSlice";

const SecurityDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dashboard,
    loading,
    error,
  } = useSelector(
    (state) => state.securityMonitoringDashboard
  );

  useEffect(() => {
    dispatch(fetchSecurityMonitoringDashboard());
  }, [dispatch]);

  const refreshDashboard = () => {
    dispatch(fetchSecurityMonitoringDashboard());
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getSeverityClass = (severity) => {
    if (severity?.toLowerCase() === "high") {
      return "severity-high";
    }

    if (severity?.toLowerCase() === "medium") {
      return "severity-medium";
    }

    return "severity-low";
  };

  return (
    <div className="security-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">
            <FaShieldAlt />
            <h2>Security Monitoring</h2>
          </div>

          <p>
            Monitor cameras, alerts, intrusions and
            security activities.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={refreshDashboard}
          disabled={loading}
        >
          <FaSyncAlt
            className={loading ? "spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="summary-grid">

        <div
          className="summary-card"
          onClick={() =>
            navigate("/admin/security/surveillance-cameras")
          }
        >
          <div className="summary-icon">
            <FaCamera />
          </div>

          <div>
            <span>Active Cameras</span>
            <strong>
              {dashboard.activeCameras}
            </strong>
          </div>
        </div>

        <div
          className="summary-card"
          onClick={() =>
            navigate("/admin/security/motion-detection-alerts")
          }
        >
          <div className="summary-icon">
            <FaBell />
          </div>

          <div>
            <span>New Alerts</span>
            <strong>
              {dashboard.newAlerts}
            </strong>
          </div>
        </div>

        <div className="summary-card high-card">
          <div className="summary-icon">
            <FaExclamationTriangle />
          </div>

          <div>
            <span>High Severity</span>
            <strong>
              {dashboard.highSeverity}
            </strong>
          </div>
        </div>

        <div
          className="summary-card"
          onClick={() =>
            navigate(
              "/admin/security/intrusion-notifications"
            )
          }
        >
          <div className="summary-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span>Intrusions</span>
            <strong>
              {dashboard.intrusions}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaUserShield />
          </div>

          <div>
            <span>Patrols</span>
            <strong>
              {dashboard.patrols}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaClipboardList />
          </div>

          <div>
            <span>Security Reports</span>
            <strong>
              {dashboard.securityReports}
            </strong>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h3>Quick Actions</h3>
            <p>
              Quickly open security monitoring modules.
            </p>
          </div>
        </div>

        <div className="quick-actions">

          <button
            onClick={() =>
              navigate(
                "/admin/security/surveillance-cameras"
              )
            }
          >
            <FaCamera />
            Surveillance Cameras
            <FaArrowRight />
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/security/live-feed"
              )
            }
          >
            <FaCamera />
            Live Camera Feed
            <FaArrowRight />
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/security/motion-detection-alerts"
              )
            }
          >
            <FaExclamationTriangle />
            Motion Alerts
            <FaArrowRight />
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/security/intrusion-notifications"
              )
            }
          >
            <FaShieldAlt />
            Intrusion Notifications
            <FaArrowRight />
          </button>

        </div>
      </div>

      {/* RECENT INCIDENTS */}
      <div className="section-card">

        <div className="section-header">
          <div>
            <h3>Recent Incidents</h3>
            <p>
              Latest security events detected by the system.
            </p>
          </div>

          <FaBell className="section-icon" />
        </div>

        {dashboard.recentIncidents?.length === 0 ? (
          <div className="empty-state">
            <FaShieldAlt />

            <h4>No Recent Incidents</h4>

            <p>
              No security incidents have been recorded.
            </p>
          </div>
        ) : (
          <div className="incident-table-wrapper">

            <table className="incident-table">

              <thead>
                <tr>
                  <th>Source</th>
                  <th>Incident</th>
                  <th>Camera</th>
                  <th>Property</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Detected</th>
                </tr>
              </thead>

              <tbody>

                {dashboard.recentIncidents.map(
                  (incident, index) => (
                    <tr key={`${incident.id}-${index}`}>

                      <td>
                        <span className="source-badge">
                          {incident.incident_source}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {incident.incident_type}
                        </strong>
                      </td>

                      <td>
                        {incident.camera_name || "-"}
                      </td>

                      <td>
                        {incident.property_name || "-"}
                      </td>

                      <td>
                        <span
                          className={`severity-badge ${getSeverityClass(
                            incident.severity
                          )}`}
                        >
                          {incident.severity}
                        </span>
                      </td>

                      <td>
                        <span className="status-badge">
                          {incident.status}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          incident.detected_at
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .security-dashboard {
          min-height: 100vh;
          padding: 25px;
          background: #f7f7f7;
          color: #111111;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-title svg {
          color: #b8860b;
          font-size: 28px;
        }

        .dashboard-title h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .dashboard-header p {
          margin: 7px 0 0;
          color: #666666;
        }

        .refresh-btn {
          border: none;
          background: #111111;
          color: #ffffff;
          padding: 11px 18px;
          border-radius: 7px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .refresh-btn:hover {
          background: #b8860b;
          color: #ffffff;
        }

        .refresh-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

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

        .dashboard-error {
          background: #111111;
          color: #ffffff;
          border-left: 5px solid #b8860b;
          padding: 14px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns:
            repeat(6, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #dddddd;
          border-top: 4px solid #b8860b;
          border-radius: 9px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 5px 18px rgba(0, 0, 0, 0.1);
        }

        .summary-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #111111;
          color: #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-card span {
          display: block;
          font-size: 13px;
          color: #666666;
          margin-bottom: 5px;
        }

        .summary-card strong {
          font-size: 25px;
          color: #111111;
        }

        .section-card {
          background: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 10px;
          padding: 22px;
          margin-bottom: 25px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .section-header p {
          margin: 5px 0 0;
          color: #777777;
          font-size: 14px;
        }

        .section-icon {
          color: #b8860b;
          font-size: 22px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 14px;
        }

        .quick-actions button {
          background: #111111;
          color: #ffffff;
          border: 1px solid #111111;
          padding: 15px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }

        .quick-actions button svg:first-child {
          color: #d4af37;
        }

        .quick-actions button svg:last-child {
          margin-left: auto;
        }

        .quick-actions button:hover {
          background: #b8860b;
          border-color: #b8860b;
        }

        .quick-actions button:hover svg:first-child {
          color: #ffffff;
        }

        .incident-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .incident-table {
          width: 100%;
          border-collapse: collapse;
        }

        .incident-table th {
          background: #111111;
          color: #ffffff;
          padding: 13px;
          text-align: left;
          font-size: 13px;
          white-space: nowrap;
        }

        .incident-table td {
          padding: 13px;
          border-bottom: 1px solid #eeeeee;
          font-size: 13px;
        }

        .incident-table tbody tr:hover {
          background: #faf8ef;
        }

        .source-badge {
          display: inline-block;
          background: #f1e5b7;
          color: #111111;
          padding: 5px 8px;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 600;
        }

        .severity-badge,
        .status-badge {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 700;
        }

        .severity-high {
          background: #111111;
          color: #ffffff;
        }

        .severity-medium {
          background: #f1e5b7;
          color: #111111;
        }

        .severity-low {
          background: #eeeeee;
          color: #111111;
        }

        .status-badge {
          background: #eeeeee;
          color: #111111;
        }

        .empty-state {
          text-align: center;
          padding: 45px 20px;
          color: #777777;
        }

        .empty-state svg {
          color: #b8860b;
          font-size: 40px;
          margin-bottom: 12px;
        }

        .empty-state h4 {
          margin: 0 0 6px;
          color: #111111;
        }

        .empty-state p {
          margin: 0;
        }

        @media (max-width: 1200px) {
          .summary-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .quick-actions {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .security-dashboard {
            padding: 15px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </div>
  );
};

export default SecurityDashboard;