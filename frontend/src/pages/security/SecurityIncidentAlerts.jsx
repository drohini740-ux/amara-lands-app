
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShieldAlt,
  FaSearch,
  FaSync,
  FaEye,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBell,
  FaMapMarkerAlt,
  FaCamera,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  fetchSecurityIncidents,
  fetchSecurityIncidentById,
  updateSecurityIncidentStatus,
  fetchMotionAlerts,
  fetchMotionAlertById,
  updateMotionAlertStatus,
  clearSelectedSecurityIncident,
  clearSecurityIncidentErrors,
} from "../../redux/securityIncidentSlice";

const STATUS_OPTIONS = [
  "New",
  "Acknowledged",
  "Resolved",
  "Dismissed",
];

const SEVERITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const SecurityIncidentAlerts = () => {
  const dispatch = useDispatch();

  const {
    incidents = [],
    motionAlerts = [],
    selectedIncident,
    selectedMotionAlert,
    incidentsLoading,
    alertsLoading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
  } = useSelector((state) => state.securityIncident || {});

  const [activeTab, setActiveTab] = useState("incidents");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = () => {
    dispatch(fetchSecurityIncidents());
    dispatch(fetchMotionAlerts());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // =====================================================
  // RESET FILTERS WHEN CHANGING TAB
  // =====================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setShowDetails(false);
    dispatch(clearSelectedSecurityIncident());
    dispatch(clearSecurityIncidentErrors());
  };

  // =====================================================
  // CURRENT DATA
  // =====================================================

  const isIncidentTab = activeTab === "incidents";

  const currentItems = isIncidentTab ? incidents : motionAlerts;

  const loading = isIncidentTab
    ? incidentsLoading
    : alertsLoading;

  // =====================================================
  // SEARCH AND FILTER
  // =====================================================

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return currentItems.filter((item) => {
      const type = isIncidentTab
        ? item.notification_type
        : item.alert_type;

      const description = isIncidentTab
        ? item.message
        : item.remarks;

      const matchesSearch = [
        item.id,
        item.property_id,
        item.camera_id,
        type,
        description,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchValue)
      );

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesSeverity =
        severityFilter === "all" ||
        String(item.severity || "").toLowerCase() ===
          severityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [
    currentItems,
    search,
    statusFilter,
    severityFilter,
    isIncidentTab,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalIncidents = incidents.length;
  const totalMotionAlerts = motionAlerts.length;

  const highPriorityCount = [...incidents, ...motionAlerts].filter(
    (item) =>
      ["high", "critical"].includes(
        String(item.severity || "").toLowerCase()
      ) &&
      !["resolved", "dismissed"].includes(
        String(item.status || "").toLowerCase()
      )
  ).length;

  const unresolvedCount = [...incidents, ...motionAlerts].filter(
    (item) =>
      !["resolved", "dismissed"].includes(
        String(item.status || "").toLowerCase()
      )
  ).length;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleString("en-IN");
  };

  // =====================================================
  // BADGE STYLES
  // =====================================================

  const getSeverityStyle = (severity) => {
    const value = String(severity || "").toLowerCase();

    if (value === "critical") {
      return { backgroundColor: "#721C24", color: "#FFFFFF" };
    }

    if (value === "high") {
      return { backgroundColor: "#F8D7DA", color: "#842029" };
    }

    if (value === "medium") {
      return { backgroundColor: "#FFF3CD", color: "#856404" };
    }

    return { backgroundColor: "#DFF5E3", color: "#198754" };
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "resolved") {
      return { backgroundColor: "#DFF5E3", color: "#198754" };
    }

    if (value === "acknowledged") {
      return { backgroundColor: "#D1ECF1", color: "#0C5460" };
    }

    if (value === "dismissed") {
      return { backgroundColor: "#E2E3E5", color: "#383D41" };
    }

    return { backgroundColor: "#FFF3CD", color: "#856404" };
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleView = (id) => {
    setShowDetails(true);

    if (isIncidentTab) {
      dispatch(fetchSecurityIncidentById(id));
    } else {
      dispatch(fetchMotionAlertById(id));
    }
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {
    setShowDetails(false);
    dispatch(clearSelectedSecurityIncident());
    dispatch(clearSecurityIncidentErrors());
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusUpdate = async (id, status) => {
    if (isIncidentTab) {
      const result = await dispatch(
        updateSecurityIncidentStatus({ id, status })
      );

      if (updateSecurityIncidentStatus.fulfilled.match(result)) {
        dispatch(fetchSecurityIncidents());
      }
    } else {
      const result = await dispatch(
        updateMotionAlertStatus({ id, status })
      );

      if (updateMotionAlertStatus.fulfilled.match(result)) {
        dispatch(fetchMotionAlerts());
      }
    }
  };

  // =====================================================
  // ACTIVE DETAIL
  // =====================================================

  const selectedRecord = isIncidentTab
    ? selectedIncident
    : selectedMotionAlert;

  const selectedType = selectedRecord
    ? isIncidentTab
      ? selectedRecord.notification_type
      : selectedRecord.alert_type
    : "";

  const selectedDescription = selectedRecord
    ? isIncidentTab
      ? selectedRecord.message
      : selectedRecord.remarks
    : "";

  const getSnapshotUrl = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      if (!["http:", "https:"].includes(parsed.protocol)) {
        return null;
      }

      return parsed.href;
    } catch {
      return null;
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3
            className="mb-1"
            style={{ fontWeight: 700, color: "#111111" }}
          >
            Incident & Alert Management
          </h3>

          <p className="mb-0 text-muted">
            Monitor intrusion incidents and motion detection alerts.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={loadData}
          disabled={incidentsLoading || alertsLoading}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#C9A227",
            border: "1px solid #C9A227",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #C9A227" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Intrusion Incidents</small>
                <h3 className="mt-2 mb-0">{totalIncidents}</h3>
              </div>
              <FaShieldAlt size={28} color="#C9A227" />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #0D6EFD" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Motion Alerts</small>
                <h3 className="mt-2 mb-0">{totalMotionAlerts}</h3>
              </div>
              <FaBell size={28} color="#0D6EFD" />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #DC3545" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">High / Critical</small>
                <h3 className="mt-2 mb-0">{highPriorityCount}</h3>
              </div>
              <FaExclamationTriangle size={28} color="#DC3545" />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #FD7E14" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Unresolved</small>
                <h3 className="mt-2 mb-0">{unresolvedCount}</h3>
              </div>
              <FaClock size={28} color="#FD7E14" />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body pb-0">
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn"
              onClick={() => handleTabChange("incidents")}
              style={{
                backgroundColor: isIncidentTab ? "#111111" : "#FFFFFF",
                color: isIncidentTab ? "#FFFFFF" : "#111111",
                border: "1px solid #111111",
              }}
            >
              <FaShieldAlt className="me-2" />
              Intrusion Incidents ({totalIncidents})
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => handleTabChange("motion")}
              style={{
                backgroundColor: !isIncidentTab ? "#111111" : "#FFFFFF",
                color: !isIncidentTab ? "#FFFFFF" : "#111111",
                border: "1px solid #111111",
              }}
            >
              <FaBell className="me-2" />
              Motion Alerts ({totalMotionAlerts})
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch color="#C9A227" />
                </span>

                <input
                  className="form-control"
                  placeholder="Search ID, property, camera, type or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                {SEVERITY_OPTIONS.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger" role="alert">
          {actionError}
        </div>
      )}

      {/* TABLE */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <strong>
            {isIncidentTab ? "Intrusion Incidents" : "Motion Detection Alerts"}
          </strong>

          <span className="text-muted small">
            Showing {filteredItems.length} of {currentItems.length}
          </span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />
              <p className="text-muted mt-3 mb-0">Loading records...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-5">
              <FaShieldAlt size={40} color="#CCCCCC" />
              <p className="text-muted mt-3 mb-0">
                No records match your filters.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>
                  <tr>
                    <th className="px-3">ID</th>
                    <th>Type</th>
                    <th>Property ID</th>
                    <th>Camera ID</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Detected At</th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => {
                    const type = isIncidentTab
                      ? item.notification_type
                      : item.alert_type;

                    const description = isIncidentTab
                      ? item.message
                      : item.remarks;

                    return (
                      <tr key={item.id}>
                        <td className="px-3">{item.id}</td>
                        <td>
                          <strong>{type || "-"}</strong>
                        </td>
                        <td>{item.property_id ?? "-"}</td>
                        <td>{item.camera_id ?? "-"}</td>
                        <td>
                          <span
                            className="badge"
                            style={getSeverityStyle(item.severity)}
                          >
                            {item.severity || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(item.status)}
                          >
                            {item.status || "Unknown"}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(item.detected_at)}
                        </td>
                        <td>
                          <div
                            style={{
                              maxWidth: 220,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={description || ""}
                          >
                            {description || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View details"
                              onClick={() => handleView(item.id)}
                              style={{
                                color: "#C9A227",
                                border: "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}

      {showDetails && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={handleCloseDetails}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
              >
                <h5 className="modal-title">
                  {isIncidentTab ? "Incident Details" : "Motion Alert Details"}
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseDetails}
                  style={{ color: "#FFFFFF" }}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border"
                      style={{ color: "#C9A227" }}
                    />
                    <p className="text-muted mt-3 mb-0">
                      Loading details...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {detailsError}
                  </div>
                ) : !selectedRecord ? (
                  <div className="text-center py-4 text-muted">
                    Record not found.
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
                      <div>
                        <h5 className="mb-1">{selectedType || "Security Alert"}</h5>
                        <small className="text-muted">
                          Record ID: #{selectedRecord.id}
                        </small>
                      </div>

                      <span
                        className="badge px-3 py-2"
                        style={getSeverityStyle(selectedRecord.severity)}
                      >
                        {selectedRecord.severity || "Unknown"} Severity
                      </span>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <small className="text-muted">Property ID</small>
                          <div className="fw-semibold mt-1">
                            {selectedRecord.property_id ?? "-"}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <small className="text-muted">Camera ID</small>
                          <div className="fw-semibold mt-1">
                            {selectedRecord.camera_id ?? "-"}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <small className="text-muted">Detected At</small>
                          <div className="fw-semibold mt-1">
                            {formatDate(selectedRecord.detected_at)}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <small className="text-muted">Created At</small>
                          <div className="fw-semibold mt-1">
                            {formatDate(selectedRecord.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Status
                        </label>

                        <select
                          className="form-select"
                          value={selectedRecord.status || "New"}
                          disabled={actionLoading}
                          onChange={(e) =>
                            handleStatusUpdate(
                              selectedRecord.id,
                              e.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <small className="text-muted">
                          Changes are saved to the server immediately.
                        </small>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Description / Remarks
                        </label>
                        <div className="p-3 bg-light rounded">
                          {selectedDescription || "No description provided."}
                        </div>
                      </div>

                      {selectedRecord.snapshot_url && (
                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            <FaCamera className="me-2" />
                            Snapshot
                          </label>

                          {getSnapshotUrl(selectedRecord.snapshot_url) ? (
                            <div>
                              <a
                                href={getSnapshotUrl(selectedRecord.snapshot_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                                style={{
                                  color: "#111111",
                                  border: "1px solid #C9A227",
                                }}
                              >
                                View Snapshot
                                <FaExternalLinkAlt className="ms-2" />
                              </a>
                            </div>
                          ) : (
                            <p className="text-muted mb-0">
                              Snapshot URL is not a valid HTTP or HTTPS link.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseDetails}
                  style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityIncidentAlerts;
