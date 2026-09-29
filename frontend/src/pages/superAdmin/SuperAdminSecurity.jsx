import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminSecurityReports,
  fetchSuperAdminSecurityReportById,
  updateSuperAdminSecurityReportStatus,

  fetchSuperAdminCameras,
  updateSuperAdminCameraStatus,

  fetchSuperAdminPatrolLogs,
  updateSuperAdminPatrolStatus,

  fetchSuperAdminIntrusionNotifications,
  updateSuperAdminIntrusionStatus,

  fetchSuperAdminMotionAlerts,
  updateSuperAdminMotionAlertStatus,

  fetchSuperAdminStaffAssignments,
  updateSuperAdminStaffAssignmentStatus,

  fetchSuperAdminVisitLogs,
} from "../../redux/superAdminSecuritySlice";

const SuperAdminSecurity = () => {
  const dispatch = useDispatch();

  const {
    reports,
    selectedReport,
    cameras,
    patrols,
    intrusions,
    motionAlerts,
    assignments,
    visits,
    loading,
    updateLoading,
    error,
  } = useSelector((state) => state.superAdminSecurity);

  const [activeTab, setActiveTab] = useState("reports");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showReportModal, setShowReportModal] = useState(false);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    dispatch(fetchSuperAdminSecurityReports());
    dispatch(fetchSuperAdminCameras());
    dispatch(fetchSuperAdminPatrolLogs());
    dispatch(fetchSuperAdminIntrusionNotifications());
    dispatch(fetchSuperAdminMotionAlerts());
    dispatch(fetchSuperAdminStaffAssignments());
    dispatch(fetchSuperAdminVisitLogs());
  }, [dispatch]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const criticalReports = reports.filter(
    (item) =>
      String(item.report_status).toLowerCase() === "critical"
  ).length;

  const completedReports = reports.filter(
    (item) =>
      String(item.report_status).toLowerCase() === "completed"
  ).length;

  const activeCameras = cameras.filter(
    (item) => String(item.status).toLowerCase() === "active"
  ).length;

  const inactiveCameras = cameras.filter(
    (item) =>
      String(item.status).toLowerCase() === "inactive"
  ).length;

  const highSeverityIntrusions = intrusions.filter(
    (item) =>
      String(item.severity).toLowerCase() === "high"
  ).length;

  const highSeverityMotion = motionAlerts.filter(
    (item) =>
      String(item.severity).toLowerCase() === "high"
  ).length;

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const text = `
        ${item.id}
        ${item.report_type}
        ${item.property_name}
        ${item.survey_number}
        ${item.user_name}
        ${item.report_status}
      `.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        String(item.report_status).toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  // =====================================================
  // REPORT VIEW
  // =====================================================

  const handleViewReport = async (id) => {
    const result = await dispatch(
      fetchSuperAdminSecurityReportById(id)
    );

    if (fetchSuperAdminSecurityReportById.fulfilled.match(result)) {
      setShowReportModal(true);
    }
  };

  // =====================================================
  // REPORT STATUS
  // =====================================================

  const handleReportStatus = async (id, report_status) => {
    await dispatch(
      updateSuperAdminSecurityReportStatus({
        id,
        report_status,
      })
    );
  };

  // =====================================================
  // CAMERA STATUS
  // =====================================================

  const handleCameraStatus = async (id, status) => {
    await dispatch(
      updateSuperAdminCameraStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // PATROL STATUS
  // =====================================================

  const handlePatrolStatus = async (id, patrol_status) => {
    await dispatch(
      updateSuperAdminPatrolStatus({
        id,
        patrol_status,
      })
    );
  };

  // =====================================================
  // INTRUSION STATUS
  // =====================================================

  const handleIntrusionStatus = async (id, status) => {
    await dispatch(
      updateSuperAdminIntrusionStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // MOTION STATUS
  // =====================================================

  const handleMotionStatus = async (id, status) => {
    await dispatch(
      updateSuperAdminMotionAlertStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // ASSIGNMENT STATUS
  // =====================================================

  const handleAssignmentStatus = async (id, status) => {
    await dispatch(
      updateSuperAdminStaffAssignmentStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN");
  };

  const statusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "critical" ||
      value === "high"
    ) {
      return {
        background: "#FDECEC",
        color: "#B42318",
      };
    }

    if (
      value === "completed" ||
      value === "resolved" ||
      value === "active"
    ) {
      return {
        background: "#EAF7EE",
        color: "#18794E",
      };
    }

    if (
      value === "pending" ||
      value === "acknowledged"
    ) {
      return {
        background: "#FFF6D8",
        color: "#8A6D00",
      };
    }

    if (value === "inactive") {
      return {
        background: "#F1F1F1",
        color: "#555555",
      };
    }

    return {
      background: "#EEEEEE",
      color: "#444444",
    };
  };

  const StatusBadge = ({ value }) => (
    <span
      style={{
        ...statusStyle(value),
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {value || "-"}
    </span>
  );

  // =====================================================
  // STYLES
  // =====================================================

  const pageStyle = {
    padding: "28px",
    minHeight: "100vh",
    background: "#F5F5F5",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "20px",
    flexWrap: "wrap",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111111",
  };

  const subtitleStyle = {
    margin: "6px 0 0",
    color: "#666666",
    fontSize: "14px",
  };

  const cardsStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  };

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E4E4E4",
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
  };

  const cardLabelStyle = {
    color: "#777777",
    fontSize: "13px",
    marginBottom: "8px",
  };

  const cardValueStyle = {
    color: "#111111",
    fontSize: "25px",
    fontWeight: "800",
  };

  const tabContainerStyle = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px",
  };

  const tabStyle = (active) => ({
    border: active
      ? "1px solid #111111"
      : "1px solid #D8D8D8",
    background: active ? "#111111" : "#FFFFFF",
    color: active ? "#D4AF37" : "#444444",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  });

  const filterStyle = {
    background: "#FFFFFF",
    padding: "15px",
    border: "1px solid #E4E4E4",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  };

  const inputStyle = {
    flex: "1 1 280px",
    padding: "11px 13px",
    border: "1px solid #D5D5D5",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
  };

  const selectStyle = {
    padding: "11px 13px",
    border: "1px solid #D5D5D5",
    borderRadius: "7px",
    background: "#FFFFFF",
    fontSize: "14px",
    minWidth: "160px",
  };

  const tableContainerStyle = {
    background: "#FFFFFF",
    border: "1px solid #E4E4E4",
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1050px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "13px 14px",
    background: "#111111",
    color: "#D4AF37",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "13px 14px",
    borderBottom: "1px solid #EEEEEE",
    color: "#333333",
    fontSize: "13px",
    verticalAlign: "middle",
  };

  const actionButton = {
    padding: "7px 10px",
    border: "1px solid #D5D5D5",
    background: "#FFFFFF",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  };

  const goldButton = {
    ...actionButton,
    background: "#111111",
    color: "#D4AF37",
    border: "1px solid #111111",
  };

  const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "#FFFFFF",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  };

  const modalHeaderStyle = {
    background: "#111111",
    color: "#D4AF37",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const detailGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    padding: "20px",
  };

  const detailBox = {
    background: "#F7F7F7",
    borderRadius: "8px",
    padding: "13px",
  };

  const detailLabel = {
    fontSize: "11px",
    color: "#777777",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const detailValue = {
    fontSize: "14px",
    color: "#222222",
    fontWeight: "600",
    wordBreak: "break-word",
  };

  // =====================================================
  // TABLE RENDERERS
  // =====================================================

  const renderReports = () => (
    <>
      <div style={filterStyle}>
        <input
          type="text"
          placeholder="Search reports, property, user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Status</option>
          <option value="Critical">Critical</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Report Type</th>
              <th style={thStyle}>Property</th>
              <th style={thStyle}>Survey No.</th>
              <th style={thStyle}>Reported By</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    padding: "35px",
                  }}
                >
                  No security reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.id}</td>

                  <td style={tdStyle}>
                    {item.report_type || "-"}
                  </td>

                  <td style={tdStyle}>
                    {item.property_name || "-"}
                  </td>

                  <td style={tdStyle}>
                    {item.survey_number || "-"}
                  </td>

                  <td style={tdStyle}>
                    {item.user_name || "-"}
                  </td>

                  <td style={tdStyle}>
                    {formatDate(item.created_at)}
                  </td>

                  <td style={tdStyle}>
                    <StatusBadge
                      value={item.report_status}
                    />
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "7px",
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleViewReport(item.id)
                        }
                        style={actionButton}
                      >
                        View
                      </button>

                      <select
                        value={item.report_status || ""}
                        onChange={(e) =>
                          handleReportStatus(
                            item.id,
                            e.target.value
                          )
                        }
                        style={{
                          ...actionButton,
                          padding: "6px 8px",
                        }}
                        disabled={updateLoading}
                      >
                        <option value="Pending">
                          Pending
                        </option>
                        <option value="Critical">
                          Critical
                        </option>
                        <option value="Completed">
                          Completed
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderCameras = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Camera</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Installation</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {cameras.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No surveillance cameras found.
              </td>
            </tr>
          ) : (
            cameras.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.camera_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.camera_type || "-"}
                </td>

                <td style={tdStyle}>
                  {item.camera_location || "-"}
                </td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {formatDate(item.installation_date)}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.status} />
                </td>

                <td
                  style={{
                    ...tdStyle,
                    whiteSpace: "nowrap",
                  }}
                >
                  <select
                    value={item.status || ""}
                    onChange={(e) =>
                      handleCameraStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    style={actionButton}
                    disabled={updateLoading}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderPatrols = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Survey No.</th>
            <th style={thStyle}>Staff</th>
            <th style={thStyle}>Patrol Date</th>
            <th style={thStyle}>Check In</th>
            <th style={thStyle}>Check Out</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {patrols.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No patrol logs found.
              </td>
            </tr>
          ) : (
            patrols.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.survey_number || "-"}
                </td>

                <td style={tdStyle}>
                  {item.user_name || "-"}
                </td>

                <td style={tdStyle}>
                  {formatDate(item.patrol_date)}
                </td>

                <td style={tdStyle}>
                  {item.check_in || "-"}
                </td>

                <td style={tdStyle}>
                  {item.check_out || "-"}
                </td>

                <td style={tdStyle}>
                  <StatusBadge
                    value={item.patrol_status}
                  />
                </td>

                <td style={tdStyle}>
                  <select
                    value={item.patrol_status || ""}
                    onChange={(e) =>
                      handlePatrolStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    style={actionButton}
                    disabled={updateLoading}
                  >
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderIntrusions = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Severity</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Camera</th>
            <th style={thStyle}>Message</th>
            <th style={thStyle}>Detected</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {intrusions.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No intrusion notifications found.
              </td>
            </tr>
          ) : (
            intrusions.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.notification_type || "-"}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.severity} />
                </td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.camera_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.message || "-"}
                </td>

                <td style={tdStyle}>
                  {formatDate(item.detected_at)}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.status} />
                </td>

                <td style={tdStyle}>
                  <select
                    value={item.status || ""}
                    onChange={(e) =>
                      handleIntrusionStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    style={actionButton}
                    disabled={updateLoading}
                  >
                    <option value="Acknowledged">
                      Acknowledged
                    </option>
                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMotionAlerts = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Alert Type</th>
            <th style={thStyle}>Severity</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Camera</th>
            <th style={thStyle}>Detected</th>
            <th style={thStyle}>Remarks</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {motionAlerts.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No motion detection alerts found.
              </td>
            </tr>
          ) : (
            motionAlerts.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.alert_type || "-"}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.severity} />
                </td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.camera_name || "-"}
                </td>

                <td style={tdStyle}>
                  {formatDate(item.detected_at)}
                </td>

                <td style={tdStyle}>
                  {item.remarks || "-"}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.status} />
                </td>

                <td style={tdStyle}>
                  <select
                    value={item.status || ""}
                    onChange={(e) =>
                      handleMotionStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    style={actionButton}
                    disabled={updateLoading}
                  >
                    <option value="Acknowledged">
                      Acknowledged
                    </option>
                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAssignments = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Staff</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Survey No.</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Assignment Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No staff assignments found.
              </td>
            </tr>
          ) : (
            assignments.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.staff_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.survey_number || "-"}
                </td>

                <td style={tdStyle}>
                  {item.assignment_type || "-"}
                </td>

                <td style={tdStyle}>
                  {formatDate(item.assignment_date)}
                </td>

                <td style={tdStyle}>
                  <StatusBadge value={item.status} />
                </td>

                <td style={tdStyle}>
                  <select
                    value={item.status || ""}
                    onChange={(e) =>
                      handleAssignmentStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    style={actionButton}
                    disabled={updateLoading}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderVisits = () => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Survey No.</th>
            <th style={thStyle}>Executive</th>
            <th style={thStyle}>Check In</th>
            <th style={thStyle}>Check Out</th>
            <th style={thStyle}>Latitude</th>
            <th style={thStyle}>Longitude</th>
          </tr>
        </thead>

        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  padding: "35px",
                }}
              >
                No visit logs found.
              </td>
            </tr>
          ) : (
            visits.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>

                <td style={tdStyle}>
                  {item.property_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.survey_number || "-"}
                </td>

                <td style={tdStyle}>
                  {item.executive_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.check_in
                    ? new Date(
                        item.check_in
                      ).toLocaleString("en-IN")
                    : "-"}
                </td>

                <td style={tdStyle}>
                  {item.check_out
                    ? new Date(
                        item.check_out
                      ).toLocaleString("en-IN")
                    : "-"}
                </td>

                <td style={tdStyle}>
                  {item.latitude ?? "-"}
                </td>

                <td style={tdStyle}>
                  {item.longitude ?? "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // =====================================================
  // MAIN CONTENT
  // =====================================================

  const renderActiveTab = () => {
    switch (activeTab) {
      case "reports":
        return renderReports();

      case "cameras":
        return renderCameras();

      case "patrols":
        return renderPatrols();

      case "intrusions":
        return renderIntrusions();

      case "motion":
        return renderMotionAlerts();

      case "assignments":
        return renderAssignments();

      case "visits":
        return renderVisits();

      default:
        return renderReports();
    }
  };

  return (
    <div style={pageStyle}>
      {/* =================================================
          HEADER
      ================================================= */}

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Security Management
          </h1>

          <p style={subtitleStyle}>
            Monitor security reports, cameras, alerts,
            patrols and field activity.
          </p>
        </div>

        <div
          style={{
            background: "#111111",
            color: "#D4AF37",
            padding: "10px 15px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          SUPER ADMIN
        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div style={cardsStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Security Reports
          </div>

          <div style={cardValueStyle}>
            {reports.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Critical Reports
          </div>

          <div style={cardValueStyle}>
            {criticalReports}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Completed Reports
          </div>

          <div style={cardValueStyle}>
            {completedReports}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Active Cameras
          </div>

          <div style={cardValueStyle}>
            {activeCameras}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Inactive Cameras
          </div>

          <div style={cardValueStyle}>
            {inactiveCameras}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            High Severity Intrusions
          </div>

          <div style={cardValueStyle}>
            {highSeverityIntrusions}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            High Severity Motion Alerts
          </div>

          <div style={cardValueStyle}>
            {highSeverityMotion}
          </div>
        </div>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div style={tabContainerStyle}>
        <button
          onClick={() => setActiveTab("reports")}
          style={tabStyle(activeTab === "reports")}
        >
          Security Reports
        </button>

        <button
          onClick={() => setActiveTab("cameras")}
          style={tabStyle(activeTab === "cameras")}
        >
          Surveillance Cameras
        </button>

        <button
          onClick={() => setActiveTab("patrols")}
          style={tabStyle(activeTab === "patrols")}
        >
          Patrol Logs
        </button>

        <button
          onClick={() => setActiveTab("intrusions")}
          style={tabStyle(activeTab === "intrusions")}
        >
          Intrusion Notifications
        </button>

        <button
          onClick={() => setActiveTab("motion")}
          style={tabStyle(activeTab === "motion")}
        >
          Motion Alerts
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          style={tabStyle(activeTab === "assignments")}
        >
          Staff Assignments
        </button>

        <button
          onClick={() => setActiveTab("visits")}
          style={tabStyle(activeTab === "visits")}
        >
          Visit Logs
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            background: "#FDECEC",
            color: "#B42318",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "18px",
            border: "1px solid #F3C5C5",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "10px",
            padding: "40px",
            textAlign: "center",
            color: "#666666",
          }}
        >
          Loading security data...
        </div>
      ) : (
        renderActiveTab()
      )}

      {/* =================================================
          REPORT MODAL
      ================================================= */}

      {showReportModal && selectedReport && (
        <div
          style={modalOverlay}
          onClick={() => setShowReportModal(false)}
        >
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeaderStyle}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                Security Report #{selectedReport.id}
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#FFFFFF",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div style={detailGrid}>
              <div style={detailBox}>
                <div style={detailLabel}>
                  Report Type
                </div>

                <div style={detailValue}>
                  {selectedReport.report_type || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Status
                </div>

                <StatusBadge
                  value={selectedReport.report_status}
                />
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Property
                </div>

                <div style={detailValue}>
                  {selectedReport.property_name || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Survey Number
                </div>

                <div style={detailValue}>
                  {selectedReport.survey_number || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  User
                </div>

                <div style={detailValue}>
                  {selectedReport.user_name || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Mobile
                </div>

                <div style={detailValue}>
                  {selectedReport.user_mobile || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Email
                </div>

                <div style={detailValue}>
                  {selectedReport.user_email || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Created
                </div>

                <div style={detailValue}>
                  {selectedReport.created_at
                    ? new Date(
                        selectedReport.created_at
                      ).toLocaleString("en-IN")
                    : "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Latitude
                </div>

                <div style={detailValue}>
                  {selectedReport.latitude || "-"}
                </div>
              </div>

              <div style={detailBox}>
                <div style={detailLabel}>
                  Longitude
                </div>

                <div style={detailValue}>
                  {selectedReport.longitude || "-"}
                </div>
              </div>

              <div
                style={{
                  ...detailBox,
                  gridColumn: "1 / -1",
                }}
              >
                <div style={detailLabel}>
                  Description
                </div>

                <div style={detailValue}>
                  {selectedReport.description || "-"}
                </div>
              </div>

              <div
                style={{
                  ...detailBox,
                  gridColumn: "1 / -1",
                }}
              >
                <div style={detailLabel}>
                  Assigned To
                </div>

                <div style={detailValue}>
                  {selectedReport.assigned_to || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSecurity;