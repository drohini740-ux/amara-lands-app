
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaSearch,
  FaSync,
  FaEye,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
} from "react-icons/fa";

import {
  fetchSecurityVisits,
  clearSecurityVisitErrors,
} from "../../redux/securityVisitSlice";

const SecurityVisits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    visits,
    loading,
    error,
  } = useSelector((state) => state.securityVisit);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // LOAD SECURITY VISITS
  // =====================================================

  useEffect(() => {
    dispatch(fetchSecurityVisits());

    return () => {
      dispatch(clearSecurityVisitErrors());
    };
  }, [dispatch]);

  // =====================================================
  // FORMAT DATE WITHOUT UTC DATE SHIFT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const datePart = String(date).slice(0, 10);
    const parts = datePart.split("-");

    if (parts.length !== 3) return "-";

    const [year, month, day] = parts.map(Number);

    if (!year || !month || !day) return "-";

    const localDate = new Date(year, month - 1, day);

    if (Number.isNaN(localDate.getTime())) return "-";

    return localDate.toLocaleDateString("en-IN");
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const timePart = String(time).slice(0, 8);
    const parts = timePart.split(":");

    if (parts.length < 2) return time;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return time;
    }

    const localTime = new Date();
    localTime.setHours(hours, minutes, 0, 0);

    return localTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (
      value === "cancelled" ||
      value === "rejected"
    ) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    if (
      value === "in_progress" ||
      value === "in progress"
    ) {
      return {
        backgroundColor: "#DDEBFF",
        color: "#084298",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  // =====================================================
  // FILTER VISITS
  // =====================================================

  const filteredVisits = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return visits.filter((visit) => {
      const matchesSearch = [
        visit.visit_id,
        visit.property_id,
        visit.property_name,
        visit.survey_number,
        visit.property_type,
        visit.address,
        visit.city,
        visit.state,
        visit.remarks,
        visit.assignment_type,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      );

      const matchesStatus =
        statusFilter === "all" ||
        String(visit.visit_status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [visits, search, statusFilter]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const completedCount = visits.filter(
    (visit) =>
      String(visit.visit_status || "").toLowerCase() ===
      "completed"
  ).length;

  const pendingCount = visits.filter(
    (visit) =>
      String(visit.visit_status || "").toLowerCase() ===
      "pending"
  ).length;

  const inProgressCount = visits.filter((visit) =>
    ["in_progress", "in progress"].includes(
      String(visit.visit_status || "").toLowerCase()
    )
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              color: "#111111",
              fontWeight: 700,
            }}
          >
            Security Visits
          </h3>

          <p className="mb-0 text-muted">
            View and monitor visits for your assigned properties.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => dispatch(fetchSecurityVisits())}
          disabled={loading}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#C9A227",
            border: "1px solid #C9A227",
          }}
        >
          <FaSync className="me-2" />
          {loading ? "Refreshing..." : "Refresh"}
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
                <small className="text-muted">
                  Total Visits
                </small>

                <h3 className="mt-2 mb-0">
                  {visits.length}
                </h3>
              </div>

              <FaClipboardList
                style={{ color: "#C9A227", fontSize: 28 }}
              />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #198754" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Completed
                </small>

                <h3 className="mt-2 mb-0">
                  {completedCount}
                </h3>
              </div>

              <FaCheckCircle
                style={{ color: "#198754", fontSize: 28 }}
              />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #D39E00" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending
                </small>

                <h3 className="mt-2 mb-0">
                  {pendingCount}
                </h3>
              </div>

              <FaHourglassHalf
                style={{ color: "#D39E00", fontSize: 28 }}
              />
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
                <small className="text-muted">
                  In Progress
                </small>

                <h3 className="mt-2 mb-0">
                  {inProgressCount}
                </h3>
              </div>

              <FaClock
                style={{ color: "#0D6EFD", fontSize: 28 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#C9A227" }} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search visit, property, survey number, or location..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">All Visit Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <span>{error}</span>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => dispatch(fetchSecurityVisits())}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* VISITS TABLE */}

      <div className="card border-0 shadow-sm">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <strong style={{ color: "#111111" }}>
              Assigned Visits
            </strong>

            <span className="text-muted small">
              Showing {filteredVisits.length} of {visits.length} visits
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && visits.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />

              <p className="mt-3 mb-0 text-muted">
                Loading Security visits...
              </p>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-5">
              <FaClipboardList
                style={{ fontSize: 42, color: "#CCCCCC" }}
              />

              <h6 className="mt-3">
                No visits found
              </h6>

              <p className="text-muted mb-0">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">Visit ID</th>
                    <th>Property</th>
                    <th>Location</th>
                    <th>Visit Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVisits.map((visit) => (
                    <tr key={visit.visit_id}>
                      <td className="px-3 fw-semibold">
                        #{visit.visit_id}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {visit.property_name || "Property"}
                        </div>

                        <small className="text-muted">
                          Survey: {visit.survey_number || "-"}
                        </small>
                      </td>

                      <td>
                        <div>
                          <FaMapMarkerAlt
                            className="me-1"
                            style={{ color: "#C9A227" }}
                          />

                          {visit.city || "-"}
                        </div>

                        <small className="text-muted">
                          {visit.state || ""}
                        </small>
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatDate(visit.visit_date)}
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatTime(visit.check_in)}
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatTime(visit.check_out)}
                      </td>

                      <td>
                        <span
                          className="badge px-2 py-2"
                          style={getStatusStyle(visit.visit_status)}
                        >
                          {visit.visit_status || "Unknown"}
                        </span>
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm"
                          title="View visit details"
                          onClick={() =>
                            navigate(`/security/visits/${visit.visit_id}`)
                          }
                          style={{
                            color: "#C9A227",
                            border: "1px solid #C9A227",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <FaEye className="me-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityVisits;

