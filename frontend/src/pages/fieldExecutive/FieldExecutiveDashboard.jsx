import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaSync,
  FaRoute,
} from "react-icons/fa";

import {
  fetchFieldExecutiveDashboard,
} from "../../redux/fieldExecutiveDashboardSlice";

const FieldExecutiveDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboard = useSelector(
    (state) => state.fieldExecutiveDashboard
  ) || {};

  const {
    overview = {},
    upcoming_visits = [],
    recent_visits = [],
    assigned_properties = [],
    loading = false,
    error = null,
  } = dashboard;

  const safeOverview = overview || {};
  const safeUpcomingVisits = Array.isArray(upcoming_visits)
    ? upcoming_visits
    : [];
  const safeRecentVisits = Array.isArray(recent_visits)
    ? recent_visits
    : [];
  const safeAssignedProperties = Array.isArray(assigned_properties)
    ? assigned_properties
    : [];

  const loadDashboard = useCallback(() => {
    dispatch(fetchFieldExecutiveDashboard());
  }, [dispatch]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return String(time).slice(0, 5);
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (
      ["completed", "verified", "approved", "active"].includes(
        normalizedStatus
      )
    ) {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (
      ["rejected", "failed", "cancelled", "overdue"].includes(
        normalizedStatus
      )
    ) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#F5E8B0",
      color: "#111111",
    };
  };

  const summaryCards = [
    {
      label: "Assigned Properties",
      value: safeOverview.total_assigned_properties ?? 0,
      icon: FaBuilding,
      color: "#C9A227",
    },
    {
      label: "Total Visits",
      value: safeOverview.total_visits ?? 0,
      icon: FaCalendarCheck,
      color: "#111111",
    },
    {
      label: "Completed Visits",
      value: safeOverview.completed_visits ?? 0,
      icon: FaCheckCircle,
      color: "#198754",
    },
    {
      label: "Pending Visits",
      value: safeOverview.pending_visits ?? 0,
      icon: FaClock,
      color: "#C99700",
    },
    {
      label: "Security Reports",
      value: safeOverview.total_security_reports ?? 0,
      icon: FaShieldAlt,
      color: "#DC3545",
    },
  ];

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
      >
        <div>
          <h3
            className="mb-1"
            style={{ fontWeight: 700, color: "#111111" }}
          >
            Field Executive Dashboard
          </h3>

          <p className="mb-0" style={{ color: "#777777" }}>
            Manage your assigned properties, visits and field activities.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={loadDashboard}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync
            className={`me-2 ${loading ? "fa-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2"
          role="alert"
        >
          <span>
            {typeof error === "string"
              ? error
              : error.message || "Unable to load dashboard data."}
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={loadDashboard}
            disabled={loading}
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div
          className="text-center py-2"
          role="status"
          aria-live="polite"
        >
          <span
            className="spinner-border spinner-border-sm me-2"
            style={{ color: "#C9A227" }}
          />
          <span className="text-muted">
            Loading dashboard...
          </span>
        </div>
      )}

      <div className="row g-3 mb-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="col-12 col-sm-6 col-xl"
              key={card.label}
            >
              <div
                className="p-4 bg-white rounded shadow-sm h-100"
                style={{
                  borderLeft: `4px solid ${card.color}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div>
                    <small className="text-muted">
                      {card.label}
                    </small>

                    <h3 className="mb-0 mt-2">
                      {card.value}
                    </h3>
                  </div>

                  <Icon
                    style={{
                      color: card.color,
                      fontSize: "28px",
                      flexShrink: 0,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <strong>My Assigned Properties</strong>

            <span style={{ color: "#777777", fontSize: "14px" }}>
              {safeAssignedProperties.length} properties
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && safeAssignedProperties.length === 0 ? (
            <div className="text-center py-4">
              <span
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />
            </div>
          ) : safeAssignedProperties.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaBuilding
                style={{ fontSize: "40px", color: "#CCCCCC" }}
              />

              <p className="mt-3 mb-0">
                No properties assigned.
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
                    <th className="px-3">Property</th>
                    <th>Survey Number</th>
                    <th>Location</th>
                    <th>Verification</th>
                    <th>Assignment</th>
                  </tr>
                </thead>

                <tbody>
                  {safeAssignedProperties.map((property, index) => (
                    <tr
                      key={
                        property.assignment_id ??
                        property.property_id ??
                        property.id ??
                        index
                      }
                    >
                      <td className="px-3">
                        <strong>
                          {property.property_name || "Unnamed Property"}
                        </strong>

                        <div
                          style={{ fontSize: "12px", color: "#777777" }}
                        >
                          {property.property_type || "-"}
                        </div>
                      </td>

                      <td>{property.survey_number || "-"}</td>

                      <td>
                        <FaMapMarkerAlt
                          className="me-1"
                          style={{ color: "#C9A227" }}
                        />

                        {[property.city, property.state]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(
                            property.verification_status
                          )}
                        >
                          {property.verification_status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(
                            property.assignment_status
                          )}
                        >
                          {property.assignment_status || "Assigned"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Upcoming Visits</strong>

                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => navigate("/field/visits")}
                  style={{
                    border: "1px solid #C9A227",
                    color: "#111111",
                  }}
                >
                  View Visits
                </button>
              </div>
            </div>

            <div className="card-body">
              {safeUpcomingVisits.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaCalendarCheck
                    style={{ fontSize: "32px", color: "#CCCCCC" }}
                  />

                  <p className="mt-3 mb-0">
                    No upcoming visits.
                  </p>
                </div>
              ) : (
                safeUpcomingVisits.map((visit, index) => (
                  <div
                    key={visit.id ?? visit.visit_id ?? index}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <strong>
                        {visit.property_name || "Property"}
                      </strong>

                      <span
                        className="badge"
                        style={getStatusStyle(visit.visit_status)}
                      >
                        {visit.visit_status || "Pending"}
                      </span>
                    </div>

                    <div
                      className="mt-2"
                      style={{ fontSize: "14px", color: "#666666" }}
                    >
                      <FaCalendarCheck className="me-2" />
                      {formatDate(visit.visit_date)}
                    </div>

                    <div
                      style={{ fontSize: "14px", color: "#666666" }}
                    >
                      <FaClock className="me-2" />
                      {formatTime(visit.check_in)} -{" "}
                      {formatTime(visit.check_out)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Recent Visits</strong>

                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => navigate("/field/visit-reports")}
                  style={{
                    border: "1px solid #C9A227",
                    color: "#111111",
                  }}
                >
                  View Reports
                </button>
              </div>
            </div>

            <div className="card-body">
              {safeRecentVisits.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaRoute
                    style={{ fontSize: "32px", color: "#CCCCCC" }}
                  />

                  <p className="mt-3 mb-0">
                    No recent visits.
                  </p>
                </div>
              ) : (
                safeRecentVisits.map((visit, index) => (
                  <div
                    key={visit.id ?? visit.visit_id ?? index}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <strong>
                        {visit.property_name || "Property"}
                      </strong>

                      <span
                        className="badge"
                        style={getStatusStyle(visit.visit_status)}
                      >
                        {visit.visit_status || "-"}
                      </span>
                    </div>

                    <div
                      className="mt-2"
                      style={{ fontSize: "14px", color: "#666666" }}
                    >
                      <FaCalendarCheck className="me-2" />
                      {formatDate(visit.visit_date)}
                    </div>

                    {visit.remarks && (
                      <div
                        className="mt-2"
                        style={{ fontSize: "13px", color: "#777777" }}
                      >
                        {visit.remarks}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldExecutiveDashboard;