
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  const {
    overview,
    upcoming_visits,
    recent_visits,
    assigned_properties,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.fieldExecutiveDashboard
  );

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveDashboard()
    );
  }, [dispatch]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    return String(time).slice(0, 5);
  };

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
            Field Executive Dashboard
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage your assigned properties,
            visits and field activities.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            dispatch(
              fetchFieldExecutiveDashboard()
            )
          }
          disabled={loading}
          style={{
            border:
              "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor:
              "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
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
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">

        {/* ASSIGNED PROPERTIES */}

        <div className="col-md-4 col-lg">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">

              <div>
                <small className="text-muted">
                  Assigned Properties
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    overview.total_assigned_properties
                  }
                </h3>
              </div>

              <FaBuilding
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* TOTAL VISITS */}

        <div className="col-md-4 col-lg">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">

              <div>
                <small className="text-muted">
                  Total Visits
                </small>

                <h3 className="mb-0 mt-2">
                  {overview.total_visits}
                </h3>
              </div>

              <FaCalendarCheck
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="col-md-4 col-lg">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between">

              <div>
                <small className="text-muted">
                  Completed Visits
                </small>

                <h3 className="mb-0 mt-2">
                  {overview.completed_visits}
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

        {/* PENDING */}

        <div className="col-md-4 col-lg">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #ffc107",
            }}
          >
            <div className="d-flex justify-content-between">

              <div>
                <small className="text-muted">
                  Pending Visits
                </small>

                <h3 className="mb-0 mt-2">
                  {overview.pending_visits}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#ffc107",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* SECURITY REPORTS */}

        <div className="col-md-4 col-lg">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between">

              <div>
                <small className="text-muted">
                  Security Reports
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    overview.total_security_reports
                  }
                </h3>
              </div>

              <FaShieldAlt
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* ASSIGNED PROPERTIES */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white py-3">

          <div className="d-flex justify-content-between align-items-center">

            <strong>
              My Assigned Properties
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              {assigned_properties.length} properties
            </span>

          </div>

        </div>

        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />
            </div>
          ) : assigned_properties.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaBuilding
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
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
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      Property
                    </th>

                    <th>
                      Survey Number
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Verification
                    </th>

                    <th>
                      Assignment
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {assigned_properties.map(
                    (property) => (
                      <tr
                        key={
                          property.assignment_id
                        }
                      >

                        <td className="px-3">
                          <strong>
                            {
                              property.property_name
                            }
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {
                              property.property_type ||
                              "-"
                            }
                          </div>
                        </td>

                        <td>
                          {
                            property.survey_number ||
                            "-"
                          }
                        </td>

                        <td>
                          <FaMapMarkerAlt
                            className="me-1"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          {property.city},{" "}
                          {property.state}
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#DFF5E3",
                              color:
                                "#198754",
                            }}
                          >
                            {
                              property.verification_status ||
                              "-"
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#F5E8B0",
                              color:
                                "#111111",
                            }}
                          >
                            {
                              property.assignment_status ||
                              "-"
                            }
                          </span>
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

      {/* ================================================= */}
      {/* VISITS */}
      {/* ================================================= */}

      <div className="row g-4">

        {/* UPCOMING VISITS */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-header bg-white py-3">

              <strong>
                Upcoming Visits
              </strong>

            </div>

            <div className="card-body">

              {upcoming_visits.length === 0 ? (

                <div className="text-center py-4 text-muted">

                  <FaCalendarCheck
                    style={{
                      fontSize: "32px",
                      color: "#CCCCCC",
                    }}
                  />

                  <p className="mt-3 mb-0">
                    No upcoming visits.
                  </p>

                </div>

              ) : (

                upcoming_visits.map(
                  (visit) => (
                    <div
                      key={visit.id}
                      className="border rounded p-3 mb-3"
                    >

                      <div className="d-flex justify-content-between">

                        <strong>
                          {
                            visit.property_name ||
                            "Property"
                          }
                        </strong>

                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              "#F5E8B0",
                            color:
                              "#111111",
                          }}
                        >
                          {
                            visit.visit_status
                          }
                        </span>

                      </div>

                      <div
                        className="mt-2"
                        style={{
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        <FaCalendarCheck className="me-2" />

                        {formatDate(
                          visit.visit_date
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        <FaClock className="me-2" />

                        {formatTime(
                          visit.check_in
                        )}{" "}
                        -{" "}
                        {formatTime(
                          visit.check_out
                        )}
                      </div>

                    </div>
                  )
                )

              )}

            </div>
          </div>
        </div>

        {/* RECENT VISITS */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-header bg-white py-3">

              <strong>
                Recent Visits
              </strong>

            </div>

            <div className="card-body">

              {recent_visits.length === 0 ? (

                <div className="text-center py-4 text-muted">

                  <FaRoute
                    style={{
                      fontSize: "32px",
                      color: "#CCCCCC",
                    }}
                  />

                  <p className="mt-3 mb-0">
                    No recent visits.
                  </p>

                </div>

              ) : (

                recent_visits.map(
                  (visit) => (
                    <div
                      key={visit.id}
                      className="border rounded p-3 mb-3"
                    >

                      <div className="d-flex justify-content-between">

                        <strong>
                          {
                            visit.property_name ||
                            "Property"
                          }
                        </strong>

                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              String(
                                visit.visit_status
                              ).toLowerCase() ===
                              "completed"
                                ? "#DFF5E3"
                                : "#F5E8B0",

                            color:
                              String(
                                visit.visit_status
                              ).toLowerCase() ===
                              "completed"
                                ? "#198754"
                                : "#111111",
                          }}
                        >
                          {
                            visit.visit_status ||
                            "-"
                          }
                        </span>

                      </div>

                      <div
                        className="mt-2"
                        style={{
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        <FaCalendarCheck className="me-2" />

                        {formatDate(
                          visit.visit_date
                        )}
                      </div>

                      {visit.remarks && (
                        <div
                          className="mt-2"
                          style={{
                            fontSize: "13px",
                            color: "#777777",
                          }}
                        >
                          {visit.remarks}
                        </div>
                      )}

                    </div>
                  )
                )

              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default FieldExecutiveDashboard;

