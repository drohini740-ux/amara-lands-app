
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaRoute,
  FaSearch,
  FaSync,
  FaEye,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";

import {
  fetchFieldExecutiveVisits,
} from "../../redux/fieldExecutiveVisitSlice";

const FieldExecutiveSiteVisits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    visits,
    loading,
    error,
  } = useSelector(
    (state) => state.fieldExecutiveVisit
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  // =====================================================
  // LOAD VISITS
  // =====================================================

  useEffect(() => {
    dispatch(fetchFieldExecutiveVisits());
  }, [dispatch]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchFieldExecutiveVisits());
  };

  // =====================================================
  // OPEN VISIT
  // =====================================================

  const handleViewVisit = (id) => {
    navigate(`/field/visits/${id}`);
  };

  // =====================================================
  // GOOGLE MAPS
  // =====================================================

  const handleNavigate = (visit) => {
    if (
      !visit.latitude ||
      !visit.longitude
    ) {
      alert(
        "Location coordinates are not available for this property."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${visit.latitude},${visit.longitude}` +
      `&travelmode=driving`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const normalizeStatus = (status) =>
    String(status || "")
      .trim()
      .toLowerCase();

  // =====================================================
  // FILTER
  // =====================================================

  const filteredVisits = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return visits.filter((visit) => {
      const matchesSearch =
        String(
          visit.property_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          visit.survey_number || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          visit.address || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          visit.city || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          visit.remarks || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(
          visit.visit_status
        ) ===
          normalizeStatus(statusFilter);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    visits,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalVisits = visits.length;

  const pendingVisits =
    visits.filter(
      (visit) =>
        normalizeStatus(
          visit.visit_status
        ) === "pending"
    ).length;

  const inProgressVisits =
    visits.filter(
      (visit) =>
        normalizeStatus(
          visit.visit_status
        ) === "in progress"
    ).length;

  const completedVisits =
    visits.filter(
      (visit) =>
        normalizeStatus(
          visit.visit_status
        ) === "completed"
    ).length;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized =
      normalizeStatus(status);

    if (normalized === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (
      normalized === "in progress"
    ) {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (normalized === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#E7E7E7",
      color: "#555555",
    };
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return String(time).substring(
      0,
      5
    );
  };

  // =====================================================
  // RENDER
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
            Site Visits
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage and monitor your field
            site visits.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={handleRefresh}
          disabled={loading}
          style={{
            border:
              "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor:
              "#FFFFFF",
          }}
        >
          {loading ? (
            <FaSpinner className="fa-spin me-2" />
          ) : (
            <FaSync className="me-2" />
          )}

          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-3">
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
                  Total Visits
                </small>

                <h3 className="mb-0 mt-2">
                  {totalVisits}
                </h3>
              </div>

              <FaRoute
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #777777",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingVisits}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#777777",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}

        <div className="col-md-3">
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
                  In Progress
                </small>

                <h3 className="mb-0 mt-2">
                  {inProgressVisits}
                </h3>
              </div>

              <FaRoute
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="col-md-3">
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
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedVisits}
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
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color:
                        "#C9A227",
                    }}
                  />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search property, survey number, location or remarks..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Visit Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="in progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
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
      {/* SITE VISITS TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Site Visit History
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredVisits.length}{" "}
              visits
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color:
                    "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading site visits...
              </p>
            </div>
          ) : filteredVisits.length ===
            0 ? (
            <div className="text-center py-5">
              <FaRoute
                style={{
                  fontSize: "40px",
                  color:
                    "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No site visits found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Visit Date
                    </th>

                    <th>
                      Check In
                    </th>

                    <th>
                      Check Out
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVisits.map(
                    (visit) => (
                      <tr
                        key={
                          visit.id
                        }
                      >
                        <td className="px-3">
                          {visit.id}
                        </td>

                        <td>
                          <strong>
                            {visit.property_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {visit.survey_number ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          <div>
                            <FaMapMarkerAlt
                              className="me-1"
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            {visit.city ||
                              "-"}
                          </div>

                          <small className="text-muted">
                            {visit.address ||
                              "-"}
                          </small>
                        </td>

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          <FaCalendarAlt
                            className="me-1"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          {formatDate(
                            visit.visit_date
                          )}
                        </td>

                        <td>
                          {formatTime(
                            visit.check_in
                          )}
                        </td>

                        <td>
                          {formatTime(
                            visit.check_out
                          )}
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                visit.visit_status
                              ),
                            }}
                          >
                            {visit.visit_status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Site Visit"
                              onClick={() =>
                                handleViewVisit(
                                  visit.id
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

                            {/* NAVIGATE */}

                            {visit.latitude &&
                              visit.longitude && (
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  title="Navigate"
                                  onClick={() =>
                                    handleNavigate(
                                      visit
                                    )
                                  }
                                  style={{
                                    color:
                                      "#111111",
                                    border:
                                      "1px solid #111111",
                                  }}
                                >
                                  <FaMapMarkerAlt />
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

export default FieldExecutiveSiteVisits;

