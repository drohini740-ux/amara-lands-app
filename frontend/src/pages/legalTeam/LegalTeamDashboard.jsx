
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaGavel,
  FaFolderOpen,
  FaClock,
  FaCalendarCheck,
  FaFileAlt,
  FaArrowRight,
  FaBalanceScale,
  FaSyncAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1/legal-team/dashboard";

const LegalTeamDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalCases: 0,
    activeCases: 0,
    pendingCases: 0,
    closedCases: 0,
    rejectedCases: 0,
    upcomingAppointments: [],
    recentCases: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard information from the backend.
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load dashboard information."
        );
      }

      setDashboard({
        totalCases: result.dashboard?.totalCases ?? 0,
        activeCases: result.dashboard?.activeCases ?? 0,
        pendingCases: result.dashboard?.pendingCases ?? 0,
        closedCases: result.dashboard?.closedCases ?? 0,
        rejectedCases: result.dashboard?.rejectedCases ?? 0,
        upcomingAppointments:
          result.dashboard?.upcomingAppointments ?? [],
        recentCases: result.dashboard?.recentCases ?? [],
      });
    } catch (err) {
      console.error("Legal Team Dashboard Error:", err);
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Format dates safely.
  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not scheduled";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return time;

    const hours = Number(match[1]);
    const minutes = match[2];

    if (hours > 23) return time;

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes} ${suffix}`;
  };

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toLowerCase().trim();

    if (["open", "in progress", "active"].includes(normalized)) {
      return {
        backgroundColor: "#E8F5E9",
        color: "#216E39",
      };
    }

    if (
      ["pending", "awaiting", "under review"].includes(normalized)
    ) {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (
      ["closed", "resolved", "completed"].includes(normalized)
    ) {
      return {
        backgroundColor: "#E8E8E8",
        color: "#444444",
      };
    }

    if (["rejected", "dismissed", "cancelled", "canceled"].includes(normalized)) {
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

  const renderStatus = (status) => (
    <span
      className="badge rounded-pill px-3 py-2"
      style={getStatusStyle(status)}
    >
      {status || "Not specified"}
    </span>
  );

  const summaryCards = [
    {
      title: "Total Cases",
      value: dashboard.totalCases,
      icon: <FaGavel />,
      color: "#C9A227",
    },
    {
      title: "Active Cases",
      value: dashboard.activeCases,
      icon: <FaFolderOpen />,
      color: "#111111",
    },
    {
      title: "Pending Cases",
      value: dashboard.pendingCases,
      icon: <FaClock />,
      color: "#C9A227",
    },
    {
      title: "Upcoming Appointments",
      value: dashboard.upcomingAppointments.length,
      icon: <FaCalendarCheck />,
      color: "#111111",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h3
            className="mb-1"
            style={{ fontWeight: "700", color: "#111111" }}
          >
            Legal Team Dashboard
          </h3>

          <p className="mb-0" style={{ color: "#777777" }}>
            Manage legal cases, consultations, property verification
            and legal documents.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchDashboard}
          disabled={loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <FaSyncAlt className={loading ? "me-2 fa-spin" : "me-2"} />
          Refresh
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="row g-4 mb-4">
        {summaryCards.map((card) => (
          <div className="col-xl-3 col-md-6" key={card.title}>
            <div
              className="bg-white rounded shadow-sm p-4 h-100"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small
                    style={{ color: "#777777", fontWeight: "600" }}
                  >
                    {card.title}
                  </small>

                  <h2
                    className="mt-2 mb-0"
                    style={{ color: "#111111", fontWeight: "700" }}
                  >
                    {loading ? "..." : card.value}
                  </h2>
                </div>

                <span style={{ color: card.color, fontSize: "30px" }}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CASE STATUS AND APPOINTMENTS */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong style={{ color: "#111111" }}>
                    Case Status Overview
                  </strong>
                  <div style={{ fontSize: "13px", color: "#777777" }}>
                    Current legal case distribution
                  </div>
                </div>

                <FaBalanceScale
                  style={{ color: "#C9A227", fontSize: "20px" }}
                />
              </div>
            </div>

            <div className="card-body">
              <div className="row g-3">
                {[
                  {
                    title: "Active",
                    value: dashboard.activeCases,
                    background: "#111111",
                    color: "#FFFFFF",
                  },
                  {
                    title: "Pending",
                    value: dashboard.pendingCases,
                    background: "#F5E8B0",
                    color: "#111111",
                  },
                  {
                    title: "Closed",
                    value: dashboard.closedCases,
                    background: "#E8E8E8",
                    color: "#111111",
                  },
                  {
                    title: "Rejected",
                    value: dashboard.rejectedCases,
                    background: "#F8D7DA",
                    color: "#842029",
                  },
                ].map((item) => (
                  <div className="col-md-6" key={item.title}>
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor: item.background,
                        color: item.color,
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <span>{item.title}</span>
                        <strong>
                          {loading ? "..." : item.value}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-sm mt-3"
                onClick={() => navigate("/legal-team/cases")}
                style={{
                  backgroundColor: "#C9A227",
                  color: "#111111",
                }}
              >
                View All Cases <FaArrowRight className="ms-2" />
              </button>
            </div>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ color: "#111111" }}>
                  Upcoming Appointments
                </strong>
                <FaCalendarCheck style={{ color: "#C9A227" }} />
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <p className="text-center text-muted py-4">
                  Loading appointments...
                </p>
              ) : dashboard.upcomingAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <FaCalendarCheck
                    style={{ fontSize: "40px", color: "#C9A227" }}
                  />
                  <p className="mt-3 mb-1 fw-semibold">
                    No upcoming appointments
                  </p>
                  <small className="text-muted">
                    Scheduled appointments will appear here.
                  </small>
                </div>
              ) : (
                <div>
                  {dashboard.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 mb-3 rounded"
                      style={{
                        backgroundColor: "#FAFAFA",
                        borderLeft: "3px solid #C9A227",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <strong style={{ color: "#111111" }}>
                          {appointment.customer_name || "Customer"}
                        </strong>
                        {renderStatus(appointment.status)}
                      </div>

                      <div className="mt-2 small text-muted">
                        <div>
                          <FaCalendarCheck className="me-2" />
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="mt-1">
                          <FaClock className="me-2" />
                          {formatTime(appointment.appointment_time)}
                        </div>
                      </div>

                      <div className="mt-2 small">
                        <strong>Purpose: </strong>
                        {appointment.purpose ||
                          appointment.service_type ||
                          "Not specified"}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => navigate("/legal-team/appointments")}
                    style={{
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                    }}
                  >
                    View Appointments <FaArrowRight className="ms-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT LEGAL CASES */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong style={{ color: "#111111" }}>
                Recent Legal Cases
              </strong>
              <div style={{ fontSize: "13px", color: "#777777" }}>
                Recently created legal cases
              </div>
            </div>

            <FaFileAlt style={{ color: "#C9A227" }} />
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">
              Loading legal cases...
            </div>
          ) : dashboard.recentCases.length === 0 ? (
            <div className="text-center py-5">
              <FaFileAlt
                style={{ fontSize: "40px", color: "#CCCCCC" }}
              />
              <p className="mt-3 mb-1 fw-semibold">
                No legal cases found
              </p>
              <small className="text-muted">
                Recent legal cases will appear here.
              </small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#F8F8F8" }}>
                  <tr>
                    <th className="px-3">Case Number</th>
                    <th>Case Title</th>
                    <th>Customer</th>
                    <th>Court</th>
                    <th>Status</th>
                    <th>Date Created</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentCases.map((legalCase) => (
                    <tr key={legalCase.id}>
                      <td className="px-3">
                        {String(legalCase.case_number || "").trim() ||
                          `CASE-${legalCase.id}`}
                      </td>
                      <td>
                        {legalCase.case_title || "Untitled Case"}
                        {legalCase.property_name && (
                          <div className="small text-muted">
                            {legalCase.property_name}
                          </div>
                        )}
                      </td>
                      <td>{legalCase.customer_name || "Not assigned"}</td>
                      <td>{legalCase.court_name || "Not specified"}</td>
                      <td>{renderStatus(legalCase.status)}</td>
                      <td>{formatDate(legalCase.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3 border-top">
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/legal-team/cases")}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
              }}
            >
              View All Legal Cases <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="card border-0 shadow-sm mt-4 mb-4">
        <div className="card-body">
          <h6
            className="mb-3"
            style={{ fontWeight: "700", color: "#111111" }}
          >
            Quick Actions
          </h6>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/legal-team/cases")}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
              }}
            >
              <FaGavel className="me-2" />
              View Legal Cases
              <FaArrowRight className="ms-2" />
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => navigate("/legal-team/appointments")}
              style={{
                backgroundColor: "#C9A227",
                color: "#111111",
              }}
            >
              <FaCalendarCheck className="me-2" />
              View Appointments
              <FaArrowRight className="ms-2" />
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => navigate("/legal-team/documents")}
              style={{
                backgroundColor: "#FFFFFF",
                color: "#111111",
                border: "1px solid #C9A227",
              }}
            >
              <FaFileAlt className="me-2" />
              View Documents
              <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTeamDashboard;
