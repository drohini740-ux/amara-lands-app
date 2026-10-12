
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaChartBar,
  FaHome,
  FaCalendarCheck,
  FaClock,
  FaFileAlt,
  FaCheckCircle,
  FaSync,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  fetchFieldExecutiveReports,
} from "../../redux/fieldExecutiveReportSlice";

const FieldExecutiveReports = () => {
  const dispatch = useDispatch();

  const {
    overview,
    visitStatusBreakdown,
    monthlyVisits,
    recentVisits,
    assignedProperties,
    loading,
    error,
  } = useSelector(
    (state) => state.fieldExecutiveReport
  );

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchFieldExecutiveReports());
  }, [dispatch]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT MONTH
  // =====================================================

  const formatMonth = (month) => {
    if (!month) return "-";

    try {
      const date = new Date(`${month}-01`);

      return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return month;
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchFieldExecutiveReports());
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !overview) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 text-muted">
          Loading reports...
        </p>
      </div>
    );
  }

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
            Reports & Analytics
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View your field visits, assigned properties
            and activity performance.
          </p>
        </div>

        <button
          className="btn"
          onClick={handleRefresh}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync
            className={`me-2 ${
              loading ? "fa-spin" : ""
            }`}
          />

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

        <div className="col-md-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Assigned Properties
                  </small>

                  <h3 className="mb-0 mt-2">
                    {
                      overview
                        .total_assigned_properties
                    }
                  </h3>
                </div>

                <FaHome
                  style={{
                    color: "#C9A227",
                    fontSize: "28px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL VISITS */}

        <div className="col-md-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
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
        </div>

        {/* COMPLETED VISITS */}

        <div className="col-md-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
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
        </div>

        {/* PENDING VISITS */}

        <div className="col-md-6 col-xl-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
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
                    color: "#dc3545",
                    fontSize: "28px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ANALYTICS */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">

        {/* VISIT STATUS */}

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <strong>
                <FaChartBar
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />

                Visit Status
              </strong>
            </div>

            <div className="card-body">
              {visitStatusBreakdown.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No visit data available.
                </div>
              ) : (
                visitStatusBreakdown.map(
                  (item) => {
                    const total =
                      overview.total_visits || 1;

                    const percentage =
                      Math.round(
                        (item.total / total) *
                          100
                      );

                    const isCompleted =
                      String(
                        item.status
                      ).toLowerCase() ===
                      "completed";

                    return (
                      <div
                        key={item.status}
                        className="mb-4"
                      >
                        <div className="d-flex justify-content-between mb-2">
                          <strong>
                            {item.status}
                          </strong>

                          <span className="text-muted">
                            {item.total} (
                            {percentage}%)
                          </span>
                        </div>

                        <div
                          className="progress"
                          style={{
                            height: "10px",
                            backgroundColor:
                              "#EEEEEE",
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                isCompleted
                                  ? "#28a745"
                                  : "#C9A227",
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>

        {/* MONTHLY VISITS */}

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <strong>
                <FaChartBar
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />

                Monthly Visits
              </strong>
            </div>

            <div className="card-body">
              {monthlyVisits.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No monthly visit data available.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Total</th>
                        <th>Completed</th>
                        <th>Pending</th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthlyVisits.map(
                        (item) => (
                          <tr key={item.month}>
                            <td>
                              <strong>
                                {formatMonth(
                                  item.month
                                )}
                              </strong>
                            </td>

                            <td>
                              {item.total}
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
                                  item.completed
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    "#FFF3CD",
                                  color:
                                    "#856404",
                                }}
                              >
                                {item.pending}
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
        </div>
      </div>

      {/* ================================================= */}
      {/* RECENT VISITS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              <FaCalendarCheck
                className="me-2"
                style={{
                  color: "#C9A227",
                }}
              />

              Recent Visits
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              {recentVisits.length} visits
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {recentVisits.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No recent visits found.
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
                      Survey Number
                    </th>

                    <th>
                      Visit Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentVisits.map(
                    (visit) => (
                      <tr key={visit.id}>
                        <td className="px-3">
                          #{visit.id}
                        </td>

                        <td>
                          <strong>
                            {visit.property_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {visit.city ||
                              "-"}
                            {visit.state
                              ? `, ${visit.state}`
                              : ""}
                          </div>
                        </td>

                        <td>
                          {visit.survey_number ||
                            "-"}
                        </td>

                        <td>
                          {formatDate(
                            visit.visit_date
                          )}
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  visit.visit_status
                                ).toLowerCase() ===
                                "completed"
                                  ? "#DFF5E3"
                                  : "#FFF3CD",
                              color:
                                String(
                                  visit.visit_status
                                ).toLowerCase() ===
                                "completed"
                                  ? "#198754"
                                  : "#856404",
                            }}
                          >
                            {visit.visit_status ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              maxWidth: "300px",
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {visit.remarks ||
                              "-"}
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

      {/* ================================================= */}
      {/* ASSIGNED PROPERTIES */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <strong>
            <FaHome
              className="me-2"
              style={{
                color: "#C9A227",
              }}
            />

            Assigned Properties
          </strong>
        </div>

        <div className="card-body p-0">
          {assignedProperties.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No assigned properties found.
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
                      Property
                    </th>

                    <th>
                      Survey Number
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Assignment
                    </th>

                    <th>
                      Verification
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignedProperties.map(
                    (property) => (
                      <tr
                        key={
                          property.assignment_id
                        }
                      >
                        <td className="px-3">
                          <strong>
                            {property.property_name ||
                              "-"}
                          </strong>
                        </td>

                        <td>
                          {property.survey_number ||
                            "-"}
                        </td>

                        <td>
                          {property.property_type ||
                            "-"}
                        </td>

                        <td>
                          <FaMapMarkerAlt
                            className="me-1"
                            style={{
                              color: "#C9A227",
                            }}
                          />

                          {property.city ||
                            "-"}
                          {property.state
                            ? `, ${property.state}`
                            : ""}
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
                            {property.assignment_status ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  property.verification_status
                                ).toLowerCase() ===
                                "verified"
                                  ? "#DFF5E3"
                                  : "#FFF3CD",
                              color:
                                String(
                                  property.verification_status
                                ).toLowerCase() ===
                                "verified"
                                  ? "#198754"
                                  : "#856404",
                            }}
                          >
                            {property.verification_status ||
                              "-"}
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
      {/* INFORMATION NOTE */}
      {/* ================================================= */}

      <div
        className="alert mt-4"
        style={{
          backgroundColor: "#FFFDF5",
          border: "1px solid #E6D48A",
          color: "#555555",
        }}
      >
        <FaFileAlt
          className="me-2"
          style={{
            color: "#C9A227",
          }}
        />

        Reports are generated from your Field Executive
        visits, property assignments and security
        activity.
      </div>
    </div>
  );
};

export default FieldExecutiveReports;

