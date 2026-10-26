
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarCheck,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaSync,
  FaRoute,
  FaBuilding,
} from "react-icons/fa";

import {
  fetchFieldExecutiveVisits,
} from "../../redux/fieldExecutiveVisitSlice";

const FieldExecutiveVisits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    visits = [],
    loading,
    error,
  } = useSelector((state) => state.fieldExecutiveVisit);

  const safeVisits = Array.isArray(visits) ? visits : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // LOAD VISITS
  useEffect(() => {
    dispatch(fetchFieldExecutiveVisits());
  }, [dispatch]);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FORMAT DATABASE TIME
  const formatTime = (time) => {
    if (!time) return "-";

    const value = String(time);
    const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);

    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);

      if (hours > 23 || minutes > 59) {
        return value;
      }

      const date = new Date();
      date.setHours(hours, minutes, Number(match[3] || 0), 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return value;
  };

  // STATUS STYLE
  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return { backgroundColor: "#DFF5E3", color: "#198754" };
    }

    if (value === "pending") {
      return { backgroundColor: "#FFF3CD", color: "#856404" };
    }

    if (value === "cancelled") {
      return { backgroundColor: "#F8D7DA", color: "#842029" };
    }

    if (value === "in progress") {
      return { backgroundColor: "#DCEBFF", color: "#0D6EFD" };
    }

    return { backgroundColor: "#E9ECEF", color: "#495057" };
  };

  // SEARCH AND FILTER
  const filteredVisits = safeVisits.filter((visit) => {
    const searchValue = search.trim().toLowerCase();

    const searchableFields = [
      visit.property_name,
      visit.survey_number,
      visit.property_type,
      visit.address,
      visit.city,
      visit.remarks,
    ];

    const matchesSearch =
      !searchValue ||
      searchableFields.some((field) =>
        String(field || "").toLowerCase().includes(searchValue)
      );

    const matchesStatus =
      statusFilter === "all" ||
      String(visit.visit_status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // SUMMARY
  const totalVisits = safeVisits.length;

  const pendingVisits = safeVisits.filter(
    (visit) =>
      String(visit.visit_status || "").toLowerCase() === "pending"
  ).length;

  const completedVisits = safeVisits.filter(
    (visit) =>
      String(visit.visit_status || "").toLowerCase() === "completed"
  ).length;

  // VIEW VISIT
  const handleView = (visit) => {
    const id = visit.id ?? visit.visit_id;

    if (id == null) {
      alert("Visit ID is not available.");
      return;
    }

    navigate(`/field/visits/${id}`);
  };

  // NAVIGATE TO PROPERTY
  const handleNavigation = (visit) => {
    const latitude = visit.latitude;
    const longitude = visit.longitude;

    if (
      latitude == null ||
      longitude == null ||
      latitude === "" ||
      longitude === "" ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      alert("Property coordinates are not available.");
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // REFRESH
  const handleRefresh = () => {
    dispatch(fetchFieldExecutiveVisits());
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3
            className="mb-1"
            style={{ fontWeight: 700, color: "#111111" }}
          >
            My Visits
          </h3>

          <p className="mb-0" style={{ color: "#777777" }}>
            Manage your assigned property visits and field activities.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={handleRefresh}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className={`me-2 ${loading ? "fa-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: "4px solid #C9A227" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Total Visits</small>
                <h3 className="mb-0 mt-2">{totalVisits}</h3>
              </div>
              <FaCalendarCheck
                style={{ color: "#C9A227", fontSize: 28 }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: "4px solid #dc3545" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Pending Visits</small>
                <h3 className="mb-0 mt-2">{pendingVisits}</h3>
              </div>
              <FaClock style={{ color: "#dc3545", fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: "4px solid #28a745" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Completed Visits</small>
                <h3 className="mb-0 mt-2">{completedVisits}</h3>
              </div>
              <FaCheckCircle
                style={{ color: "#28a745", fontSize: 28 }}
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
                  type="search"
                  className="form-control"
                  placeholder="Search property, survey number, location or remarks..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Visit Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center gap-2">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleRefresh}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* VISITS TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <strong>Assigned Visits</strong>
            <span style={{ color: "#777777", fontSize: 14 }}>
              Showing {filteredVisits.length} of {totalVisits} visits
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && safeVisits.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
                style={{ color: "#C9A227" }}
              />
              <p className="mt-3 mb-0">Loading visits...</p>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-5">
              <FaCalendarCheck
                style={{ fontSize: 40, color: "#CCCCCC" }}
              />
              <p className="mt-3 text-muted">
                {error ? "Unable to load visits. Please retry." : "No visits found."}
              </p>
              {search || statusFilter !== "all" ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
                >
                  <tr>
                    <th className="px-3">ID</th>
                    <th>Property</th>
                    <th>Survey No.</th>
                    <th>Location</th>
                    <th>Visit Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVisits.map((visit, index) => {
                    const visitId = visit.id ?? visit.visit_id;

                    return (
                      <tr key={visitId ?? `visit-${index}`}>
                        <td className="px-3">{visitId ?? "-"}</td>

                        <td>
                          <div className="d-flex align-items-start">
                            <FaBuilding
                              className="me-2 mt-1"
                              style={{ color: "#C9A227" }}
                            />
                            <div>
                              <strong>{visit.property_name || "-"}</strong>
                              <div
                                style={{ fontSize: 12, color: "#777777" }}
                              >
                                {visit.property_type || "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{visit.survey_number || "-"}</td>

                        <td>
                          <div>
                            <strong>{visit.city || "-"}</strong>
                            <div
                              style={{ fontSize: 12, color: "#777777" }}
                            >
                              {visit.address || "-"}
                            </div>
                          </div>
                        </td>

                        <td>{formatDate(visit.visit_date)}</td>
                        <td>{formatTime(visit.check_in)}</td>
                        <td>{formatTime(visit.check_out)}</td>

                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(visit.visit_status)}
                          >
                            {visit.visit_status || "-"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Visit"
                              aria-label={`View visit ${visitId ?? ""}`}
                              onClick={() => handleView(visit)}
                              disabled={visitId == null}
                              style={{
                                color: "#C9A227",
                                border: "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Navigate to Property"
                              aria-label="Navigate to property"
                              onClick={() => handleNavigation(visit)}
                              style={{
                                color: "#111111",
                                border: "1px solid #111111",
                              }}
                            >
                              <FaRoute />
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
    </div>
  );
};

export default FieldExecutiveVisits;
