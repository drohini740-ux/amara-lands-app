
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBell,
  FaShieldAlt,
  FaImage,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

import api from "../../services/api";

import {
  fetchMotionDetectionAlerts,
  createMotionDetectionAlertRecord,
  updateMotionDetectionAlertById,
  clearMotionDetectionAlertError,
} from "../../redux/securityMotionAlertSlice";

const GOLD = "#C9A227";
const DARK = "#111111";
const PANEL = "#1B1B1B";
const BORDER = "#333333";
const WHITE = "#FFFFFF";
const MUTED = "#AAAAAA";

const STATUSES = ["New", "Acknowledged", "Resolved", "Dismissed"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

const statusColors = {
  New: "#60A5FA",
  Acknowledged: GOLD,
  Resolved: "#4ADE80",
  Dismissed: "#9CA3AF",
};

const severityColors = {
  Low: "#4ADE80",
  Medium: "#FACC15",
  High: "#FB923C",
  Critical: "#F87171",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
};

// Accept common API response formats.
const extractRows = (responseData, keys = []) => {
  if (Array.isArray(responseData)) return responseData;

  if (Array.isArray(responseData?.data)) return responseData.data;

  for (const key of keys) {
    if (Array.isArray(responseData?.[key])) {
      return responseData[key];
    }
  }

  return [];
};

const MotionDetectionAlerts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    alerts = [],
    loading = false,
    creating = false,
    updating = false,
    error = null,
    message = null,
  } = useSelector((state) => state.securityMotionAlerts || {});

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  // Create alert form state.
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  const [form, setForm] = useState({
    property_id: "",
    camera_id: "",
    alert_type: "Motion Detected",
    severity: "Medium",
    snapshot_url: "",
    remarks: "",
  });

  const loadAlerts = () => {
    dispatch(fetchMotionDetectionAlerts({}));
  };

  useEffect(() => {
    loadAlerts();
    // Load the current alert list when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) setActionError(error);
  }, [error]);

  useEffect(() => {
    if (message) setActionMessage(message);
  }, [message]);

  // Load property and camera options when the form opens.
  useEffect(() => {
    if (!showCreateForm) return;

    let cancelled = false;

    const loadFormOptions = async () => {
      setLoadingOptions(true);
      setOptionsError("");

      try {
        const [propertyResponse, cameraResponse] = await Promise.all([
          api.get("/properties"),
          api.get("/surveillance-cameras"),
        ]);

        if (cancelled) return;

        setProperties(
          extractRows(propertyResponse.data, ["properties"])
        );

        setCameras(
          extractRows(cameraResponse.data, ["cameras"])
        );
      } catch (err) {
        if (cancelled) return;

        setOptionsError(
          err.response?.data?.message ||
            "Unable to load properties or cameras. Please check the API routes and permissions."
        );
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    loadFormOptions();

    return () => {
      cancelled = true;
    };
  }, [showCreateForm]);

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return alerts.filter((alert) => {
      const matchesSearch =
        !term ||
        [
          alert.id,
          alert.property_name,
          alert.survey_number,
          alert.camera_name,
          alert.camera_location,
          alert.alert_type,
          alert.remarks,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(term)
        );

      const matchesSeverity =
        severityFilter === "All" ||
        alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, search, severityFilter, statusFilter]);

  const totalAlerts = alerts.length;

  const newAlerts = alerts.filter(
    (alert) => alert.status === "New"
  ).length;

  const criticalAlerts = alerts.filter(
    (alert) =>
      ["High", "Critical"].includes(alert.severity) &&
      !["Resolved", "Dismissed"].includes(alert.status)
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  const selectedPropertyId = Number(form.property_id);

  const availableCameras = cameras.filter(
    (camera) =>
      Number(camera.property_id) === selectedPropertyId
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "property_id" ? { camera_id: "" } : {}),
    }));
  };

  const closeCreateForm = () => {
    if (creating) return;

    setShowCreateForm(false);
    setOptionsError("");

    setForm({
      property_id: "",
      camera_id: "",
      alert_type: "Motion Detected",
      severity: "Medium",
      snapshot_url: "",
      remarks: "",
    });
  };

  const handleCreateAlert = async (event) => {
    event.preventDefault();

    setActionError("");
    setActionMessage("");
    setOptionsError("");

    if (!form.property_id || !form.camera_id) {
      setActionError("Please select a property and camera.");
      return;
    }

    if (!form.alert_type.trim()) {
      setActionError("Please enter an alert type.");
      return;
    }

    const selectedCamera = cameras.find(
      (camera) => Number(camera.id) === Number(form.camera_id)
    );

    if (
      !selectedCamera ||
      Number(selectedCamera.property_id) !== Number(form.property_id)
    ) {
      setActionError(
        "Please select a camera belonging to the selected property."
      );
      return;
    }

    try {
      await dispatch(
        createMotionDetectionAlertRecord({
          property_id: Number(form.property_id),
          camera_id: Number(form.camera_id),
          alert_type: form.alert_type.trim(),
          severity: form.severity,
          snapshot_url: form.snapshot_url.trim() || null,
          remarks: form.remarks.trim() || null,
        })
      ).unwrap();

      closeCreateForm();

      // Fetch the joined property and camera details from the backend.
      await dispatch(fetchMotionDetectionAlerts({})).unwrap();

      setActionError("");
      setActionMessage("Motion detection alert created successfully.");
    } catch (err) {
      setActionError(
        typeof err === "string"
          ? err
          : err?.message ||
              "Unable to create the motion alert. Please try again."
      );
    }
  };

  const updateStatus = async (alert, status) => {
    setActionError("");
    setActionMessage("");

    dispatch(clearMotionDetectionAlertError());

    try {
      await dispatch(
        updateMotionDetectionAlertById({
          id: alert.id,
          status,
        })
      ).unwrap();

      setActionMessage(`Alert #${alert.id} marked as ${status}.`);
    } catch (err) {
      setActionError(
        typeof err === "string"
          ? err
          : "Unable to update the alert. Please try again."
      );
    }
  };

  const buttonStyle = {
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "9px 12px",
    background: "#252525",
    color: WHITE,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  };

  const selectStyle = {
    background: "#222222",
    color: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "10px",
    outline: "none",
    minWidth: "135px",
  };

  const formFieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: "#222222",
    color: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "12px",
    outline: "none",
    marginTop: "7px",
  };

  const fieldLabelStyle = {
    display: "block",
    color: "#DDDDDD",
    fontSize: "13px",
    fontWeight: 600,
  };

  const cardStyle = {
    background: PANEL,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "18px",
    minWidth: 0,
  };

  const renderBadge = (value, color) => (
    <span
      style={{
        display: "inline-block",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        color,
        background: `${color}18`,
        border: `1px solid ${color}55`,
        whiteSpace: "nowrap",
      }}
    >
      {value || "Unknown"}
    </span>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DARK,
        color: WHITE,
        padding: "28px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "26px",
        }}
      >
        <div>
          <div
            style={{
              color: GOLD,
              fontSize: "12px",
              letterSpacing: "2px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            AMARA LANDS / SECURITY
          </div>

          <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
            Motion Detection Alerts
          </h1>

          <p style={{ color: MUTED, margin: "9px 0 0" }}>
            Monitor, review, and manage property motion alerts.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setActionError("");
              setActionMessage("");
              setShowCreateForm(true);
            }}
            style={{
              ...buttonStyle,
              background: GOLD,
              color: DARK,
              borderColor: GOLD,
              padding: "11px 16px",
              fontWeight: 700,
            }}
          >
            <FaPlus /> Add Motion Alert
          </button>

          <button
            type="button"
            onClick={loadAlerts}
            disabled={loading}
            style={{
              ...buttonStyle,
              padding: "11px 16px",
            }}
          >
            <FaSyncAlt /> {loading ? "Loading..." : "Refresh Alerts"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {(actionError || actionMessage) && (
        <div
          role="status"
          style={{
            padding: "12px 15px",
            marginBottom: "18px",
            borderRadius: "7px",
            border: `1px solid ${actionError ? "#F87171" : GOLD}`,
            color: actionError ? "#FCA5A5" : GOLD,
            background: PANEL,
          }}
        >
          {actionError || actionMessage}

          <button
            type="button"
            onClick={() => {
              setActionError("");
              setActionMessage("");
              dispatch(clearMotionDetectionAlertError());
            }}
            style={{
              float: "right",
              background: "transparent",
              border: 0,
              color: WHITE,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Create Motion Alert Modal */}
      {showCreateForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-motion-alert-title"
          onClick={closeCreateForm}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(0,0,0,0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <form
            onSubmit={handleCreateAlert}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(650px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
              background: PANEL,
              border: `1px solid ${GOLD}`,
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <div>
                <h2
                  id="create-motion-alert-title"
                  style={{ margin: 0, fontSize: "21px", color: GOLD }}
                >
                  Add Motion Alert
                </h2>
                <p style={{ color: MUTED, fontSize: "13px", marginBottom: 0 }}>
                  Create a motion detection alert for a property camera.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateForm}
                disabled={creating}
                aria-label="Close form"
                style={buttonStyle}
              >
                <FaTimes />
              </button>
            </div>

            {loadingOptions ? (
              <p style={{ color: MUTED }}>Loading properties and cameras...</p>
            ) : (
              <>
                {optionsError && (
                  <div
                    role="alert"
                    style={{
                      color: "#FCA5A5",
                      background: "#321D1D",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "16px",
                      fontSize: "13px",
                    }}
                  >
                    {optionsError}
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "17px",
                  }}
                >
                  <label style={fieldLabelStyle}>
                    Property *
                    <select
                      name="property_id"
                      value={form.property_id}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    >
                      <option value="">Select property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.property_name ||
                            `Property #${property.id}`}
                          {property.survey_number
                            ? ` — ${property.survey_number}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={fieldLabelStyle}>
                    Camera *
                    <select
                      name="camera_id"
                      value={form.camera_id}
                      onChange={handleFormChange}
                      required
                      disabled={!form.property_id}
                      style={formFieldStyle}
                    >
                      <option value="">
                        {!form.property_id
                          ? "Select a property first"
                          : availableCameras.length
                            ? "Select camera"
                            : "No cameras for this property"}
                      </option>

                      {availableCameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                          {camera.camera_name || `Camera #${camera.id}`}
                          {camera.camera_location
                            ? ` — ${camera.camera_location}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={fieldLabelStyle}>
                    Alert Type *
                    <input
                      name="alert_type"
                      value={form.alert_type}
                      onChange={handleFormChange}
                      required
                      maxLength={100}
                      placeholder="e.g. Motion Detected"
                      style={formFieldStyle}
                    />
                  </label>

                  <label style={fieldLabelStyle}>
                    Severity *
                    <select
                      name="severity"
                      value={form.severity}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    >
                      {SEVERITIES.map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label
                    style={{
                      ...fieldLabelStyle,
                      gridColumn: "1 / -1",
                    }}
                  >
                    Snapshot URL (optional)
                    <input
                      type="url"
                      name="snapshot_url"
                      value={form.snapshot_url}
                      onChange={handleFormChange}
                      placeholder="https://example.com/snapshot.jpg"
                      style={formFieldStyle}
                    />
                  </label>

                  <label
                    style={{
                      ...fieldLabelStyle,
                      gridColumn: "1 / -1",
                    }}
                  >
                    Remarks (optional)
                    <textarea
                      name="remarks"
                      value={form.remarks}
                      onChange={handleFormChange}
                      maxLength={5000}
                      rows={4}
                      placeholder="Describe the detected movement or incident..."
                      style={{
                        ...formFieldStyle,
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </label>
                </div>
              </>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={closeCreateForm}
                disabled={creating}
                style={buttonStyle}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  creating ||
                  loadingOptions ||
                  !properties.length ||
                  !cameras.length
                }
                style={{
                  ...buttonStyle,
                  background: GOLD,
                  color: DARK,
                  borderColor: GOLD,
                  padding: "11px 18px",
                  fontWeight: 700,
                  opacity:
                    creating ||
                    loadingOptions ||
                    !properties.length ||
                    !cameras.length
                      ? 0.6
                      : 1,
                }}
              >
                <FaPlus />
                {creating ? "Creating Alert..." : "Create Alert"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            title: "Total Alerts",
            value: totalAlerts,
            icon: <FaBell />,
            color: GOLD,
          },
          {
            title: "New Alerts",
            value: newAlerts,
            icon: <FaExclamationTriangle />,
            color: "#60A5FA",
          },
          {
            title: "High / Critical Active",
            value: criticalAlerts,
            icon: <FaShieldAlt />,
            color: "#F87171",
          },
          {
            title: "Resolved Alerts",
            value: resolvedAlerts,
            icon: <FaCheckCircle />,
            color: "#4ADE80",
          },
        ].map((item) => (
          <div key={item.title} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: MUTED, fontSize: "13px" }}>
                {item.title}
              </span>
              <span style={{ color: item.color, fontSize: "20px" }}>
                {item.icon}
              </span>
            </div>

            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                marginTop: "15px",
              }}
            >
              {loading && alerts.length === 0 ? "—" : item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div style={{ ...cardStyle, marginBottom: "18px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: "1 1 240px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#222222",
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              padding: "0 12px",
            }}
          >
            <FaSearch style={{ color: GOLD }} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search property, camera, alert..."
              aria-label="Search motion alerts"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "11px 0",
                border: 0,
                outline: 0,
                background: "transparent",
                color: WHITE,
              }}
            />
          </div>

          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            style={selectStyle}
            aria-label="Filter by severity"
          >
            <option value="All">All Severities</option>
            {SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={selectStyle}
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts table */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: "17px", margin: 0 }}>
            Motion Alert Records
          </h2>
          <span style={{ color: MUTED, fontSize: "12px" }}>
            Showing {filteredAlerts.length} of {totalAlerts} alerts
          </span>
        </div>

        {loading && alerts.length === 0 ? (
          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
              color: MUTED,
            }}
          >
            Loading motion detection alerts...
          </div>
        ) : error && alerts.length === 0 ? (
          <div style={{ padding: "35px 20px", textAlign: "center" }}>
            <p style={{ color: "#FCA5A5" }}>{error}</p>
            <button type="button" onClick={loadAlerts} style={buttonStyle}>
              Try Again
            </button>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
              color: MUTED,
            }}
          >
            <FaBell
              size={28}
              style={{ color: GOLD, marginBottom: "12px" }}
            />
            <p style={{ margin: 0 }}>No motion alerts match your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1050px",
              }}
            >
              <thead>
                <tr style={{ background: "#242424", textAlign: "left" }}>
                  {[
                    "Alert",
                    "Property",
                    "Camera",
                    "Severity",
                    "Detected At",
                    "Status",
                    "Snapshot",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "14px 12px",
                        color: GOLD,
                        fontSize: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ fontWeight: 700 }}>#{alert.id}</div>
                      <div
                        style={{
                          color: MUTED,
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {alert.alert_type}
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <div>
                        {alert.property_name || "Property unavailable"}
                      </div>
                      <div
                        style={{
                          color: MUTED,
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Survey: {alert.survey_number || "—"}
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <div>
                        {alert.camera_name || `Camera #${alert.camera_id}`}
                      </div>
                      <div
                        style={{
                          color: MUTED,
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {alert.camera_location || alert.camera_type || "—"}
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {renderBadge(
                        alert.severity,
                        severityColors[alert.severity] || MUTED
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(alert.detected_at)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {renderBadge(
                        alert.status,
                        statusColors[alert.status] || MUTED
                      )}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {alert.snapshot_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSnapshot({
                              url: alert.snapshot_url,
                              id: alert.id,
                            })
                          }
                          style={buttonStyle}
                        >
                          <FaImage /> View
                        </button>
                      ) : (
                        <span style={{ color: MUTED, fontSize: "12px" }}>
                          No snapshot
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "7px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/security/motion-alerts/${alert.id}`)
                          }
                          title="View alert details"
                          style={buttonStyle}
                        >
                          <FaEye /> View
                        </button>

                        {alert.status === "New" && (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => updateStatus(alert, "Acknowledged")}
                            style={{
                              ...buttonStyle,
                              color: GOLD,
                              borderColor: GOLD,
                            }}
                          >
                            <FaCheckCircle /> Acknowledge
                          </button>
                        )}

                        {!["Resolved", "Dismissed"].includes(alert.status) && (
                          <>
                            <button
                              type="button"
                              disabled={updating}
                              onClick={() => updateStatus(alert, "Resolved")}
                              style={{
                                ...buttonStyle,
                                color: "#4ADE80",
                              }}
                            >
                              <FaCheckCircle /> Resolve
                            </button>

                            <button
                              type="button"
                              disabled={updating}
                              onClick={() => updateStatus(alert, "Dismissed")}
                              style={{
                                ...buttonStyle,
                                color: "#F87171",
                              }}
                            >
                              <FaTimesCircle /> Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Snapshot modal */}
      {selectedSnapshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Snapshot for alert ${selectedSnapshot.id}`}
          onClick={() => setSelectedSnapshot(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: PANEL,
              border: `1px solid ${GOLD}`,
              borderRadius: "10px",
              width: "min(800px, 100%)",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ margin: 0, color: GOLD }}>
                Alert #{selectedSnapshot.id} Snapshot
              </h3>
              <button
                type="button"
                onClick={() => setSelectedSnapshot(null)}
                style={buttonStyle}
              >
                Close ×
              </button>
            </div>

            <img
              src={selectedSnapshot.url}
              alt={`Motion detection snapshot for alert ${selectedSnapshot.id}`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const message = event.currentTarget.nextElementSibling;
                if (message) message.style.display = "block";
              }}
              style={{
                display: "block",
                width: "100%",
                maxHeight: "65vh",
                objectFit: "contain",
                background: DARK,
                borderRadius: "6px",
              }}
            />

            <p
              style={{
                display: "none",
                color: "#FCA5A5",
                marginTop: "12px",
              }}
            >
              Unable to load this snapshot. Check the image URL or camera
              storage permissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotionDetectionAlerts;
