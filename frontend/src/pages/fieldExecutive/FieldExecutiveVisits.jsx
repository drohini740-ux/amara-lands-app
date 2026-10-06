
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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    try {
      return new Date(
        `1970-01-01T${time}`
      ).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return time;
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "pending") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (value === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    if (value === "in progress") {
      return {
        backgroundColor: "#DCEBFF",
        color: "#0D6EFD",
      };
    }

    return {
      backgroundColor: "#E9ECEF",
      color: "#495057",
    };
  };

  // =====================================================
  // FILTER VISITS
  // =====================================================

  const filteredVisits = visits.filter(
    (visit) => {
      const searchValue =
        search.toLowerCase();

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
          visit.property_type || ""
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
        String(
          visit.visit_status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalVisits =
    visits.length;

  const pendingVisits =
    visits.filter(
      (visit) =>
        String(
          visit.visit_status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  const completedVisits =
    visits.filter(
      (visit) =>
        String(
          visit.visit_status || ""
        ).toLowerCase() ===
        "completed"
    ).length;

  // =====================================================
  // VIEW VISIT
  // =====================================================

  const handleView = (id) => {
    navigate(`/field/visits/${id}`);
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (visit) => {
    if (
      !visit.latitude ||
      !visit.longitude
    ) {
      alert(
        "Property coordinates are not available."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${visit.latitude},${visit.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // RETURN
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
            My Visits
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage your assigned property visits
            and field activities.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            dispatch(
              fetchFieldExecutiveVisits()
            )
          }
          disabled={loading}
          style={{
            border:
              "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
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

              <FaCalendarCheck
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending Visits
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingVisits}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="col-md-4">
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
                  Completed Visits
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
            {/* SEARCH */}

            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color: "#C9A227",
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

            {/* STATUS */}

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

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

                <option value="in progress">
                  In Progress
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
      {/* VISITS TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Assigned Visits
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredVisits.length} visits
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading visits...
              </p>
            </div>
          ) : filteredVisits.length ===
            0 ? (
            <div className="text-center py-5">
              <FaCalendarCheck
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No visits found.
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
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Survey No.
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
                      <tr key={visit.id}>
                        <td className="px-3">
                          {visit.id}
                        </td>

                        <td>
                          <div className="d-flex align-items-start">
                            <FaBuilding
                              className="me-2 mt-1"
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            <div>
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
                                {visit.property_type ||
                                  "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {visit.survey_number ||
                            "-"}
                        </td>

                        <td>
                          <div>
                            <strong>
                              {visit.city ||
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
                              {visit.address ||
                                "-"}
                            </div>
                          </div>
                        </td>

                        <td>
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
                            style={getStatusStyle(
                              visit.visit_status
                            )}
                          >
                            {visit.visit_status ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Visit"
                              onClick={() =>
                                handleView(
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

                            <button
                              className="btn btn-sm"
                              title="Navigate to Property"
                              onClick={() =>
                                handleNavigation(
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
                              <FaRoute />
                            </button>
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

export default FieldExecutiveVisits;

