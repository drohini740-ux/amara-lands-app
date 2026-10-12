
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShieldAlt,
  FaBuilding,
  FaFileAlt,
  FaWalking,
  FaCheckCircle,
  FaExclamationTriangle,
  FaVideo,
  FaBell,
  FaMapMarkerAlt,
  FaSync,
} from "react-icons/fa";

import {
  fetchSecurityDashboard,
  clearSecurityDashboardError,
} from "../../redux/securityDashboardSlice";

const SecurityDashboard = () => {
  const dispatch = useDispatch();

  const {
    overview,
    recentReports,
    recentPatrols,
    assignedProperties,
    loading,
    error,
  } = useSelector(
    (state) => state.securityDashboard
  );

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    dispatch(fetchSecurityDashboard());

    return () => {
      dispatch(clearSecurityDashboardError());
    };
  }, [dispatch]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchSecurityDashboard());
  };

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
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    return String(time).substring(0, 5);
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "completed" ||
      value === "active" ||
      value === "verified" ||
      value === "resolved"
    ) {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (
      value === "rejected" ||
      value === "failed" ||
      value === "cancelled"
    ) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center mb-1">
            <FaShieldAlt
              className="me-2"
              style={{
                color: "#C9A227",
                fontSize: "25px",
              }}
            />

            <h3
              className="mb-0"
              style={{
                fontWeight: "700",
                color: "#111111",
              }}
            >
              Security Dashboard
            </h3>
          </div>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor assigned properties, patrols,
            security reports and alerts.
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
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>

          <button
            className="btn btn-sm"
            onClick={handleRefresh}
            style={{
              border: "1px solid #842029",
              color: "#842029",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading &&
      !overview ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{
              color: "#C9A227",
            }}
          />

          <p className="mt-3 text-muted">
            Loading Security Dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* ============================================= */}
          {/* SUMMARY CARDS */}
          {/* ============================================= */}

          <div className="row g-4 mb-4">
            {/* ASSIGNED PROPERTIES */}

            <div className="col-xl-3 col-md-6">
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

                    <FaBuilding
                      style={{
                        color: "#C9A227",
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECURITY REPORTS */}

            <div className="col-xl-3 col-md-6">
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
                        Security Reports
                      </small>

                      <h3 className="mb-0 mt-2">
                        {
                          overview
                            .total_security_reports
                        }
                      </h3>
                    </div>

                    <FaFileAlt
                      style={{
                        color: "#111111",
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL PATROLS */}

            <div className="col-xl-3 col-md-6">
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
                        Total Patrols
                      </small>

                      <h3 className="mb-0 mt-2">
                        {
                          overview.total_patrols
                        }
                      </h3>

                      <small
                        style={{
                          color: "#198754",
                        }}
                      >
                        {
                          overview
                            .completed_patrols
                        }{" "}
                        completed
                      </small>
                    </div>

                    <FaWalking
                      style={{
                        color: "#28a745",
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE INCIDENTS */}

            <div className="col-xl-3 col-md-6">
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
                        Active Incidents
                      </small>

                      <h3 className="mb-0 mt-2">
                        {
                          overview
                            .active_incidents
                        }
                      </h3>

                      <small
                        style={{
                          color: "#842029",
                        }}
                      >
                        {
                          overview
                            .total_incidents
                        }{" "}
                        total incidents
                      </small>
                    </div>

                    <FaExclamationTriangle
                      style={{
                        color: "#dc3545",
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SECONDARY STATS */}
          {/* ================================================= */}

          <div className="row g-4 mb-4">
            {/* MOTION ALERTS */}

            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor:
                          "#FFF3CD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        marginRight: "15px",
                      }}
                    >
                      <FaBell
                        style={{
                          color: "#C9A227",
                          fontSize: "22px",
                        }}
                      />
                    </div>

                    <div>
                      <small className="text-muted">
                        Motion Detection Alerts
                      </small>

                      <h4 className="mb-0 mt-1">
                        {
                          overview
                            .total_motion_alerts
                        }
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE CAMERAS */}

            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor:
                          "#E9F7EF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        marginRight: "15px",
                      }}
                    >
                      <FaVideo
                        style={{
                          color: "#198754",
                          fontSize: "22px",
                        }}
                      />
                    </div>

                    <div>
                      <small className="text-muted">
                        Active Cameras
                      </small>

                      <h4 className="mb-0 mt-1">
                        {
                          overview
                            .active_cameras
                        }
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RECENT REPORTS + RECENT PATROLS */}
          {/* ================================================= */}

          <div className="row g-4 mb-4">
            {/* RECENT REPORTS */}

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>
                      <FaFileAlt
                        className="me-2"
                        style={{
                          color: "#C9A227",
                        }}
                      />
                      Recent Security Reports
                    </strong>

                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777777",
                      }}
                    >
                      {recentReports.length}
                    </span>
                  </div>
                </div>

                <div className="card-body p-0">
                  {recentReports.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <FaFileAlt
                        style={{
                          fontSize: "35px",
                          color: "#CCCCCC",
                        }}
                      />

                      <p className="mt-3 mb-0">
                        No security reports yet.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead
                          style={{
                            backgroundColor:
                              "#111111",
                            color: "#FFFFFF",
                          }}
                        >
                          <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentReports.map(
                            (report) => (
                              <tr
                                key={
                                  report.id
                                }
                              >
                                <td>
                                  <strong>
                                    {report.property_name ||
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
                                    {report.city ||
                                      "-"}
                                  </div>
                                </td>

                                <td>
                                  {report.report_type ||
                                    "-"}
                                </td>

                                <td>
                                  <span
                                    className="badge"
                                    style={getStatusStyle(
                                      report.report_status
                                    )}
                                  >
                                    {report.report_status ||
                                      "-"}
                                  </span>
                                </td>

                                <td>
                                  {formatDate(
                                    report.created_at
                                  )}
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

            {/* RECENT PATROLS */}

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>
                      <FaWalking
                        className="me-2"
                        style={{
                          color: "#C9A227",
                        }}
                      />
                      Recent Patrols
                    </strong>

                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777777",
                      }}
                    >
                      {recentPatrols.length}
                    </span>
                  </div>
                </div>

                <div className="card-body p-0">
                  {recentPatrols.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <FaWalking
                        style={{
                          fontSize: "35px",
                          color: "#CCCCCC",
                        }}
                      />

                      <p className="mt-3 mb-0">
                        No patrols yet.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead
                          style={{
                            backgroundColor:
                              "#111111",
                            color: "#FFFFFF",
                          }}
                        >
                          <tr>
                            <th>Property</th>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentPatrols.map(
                            (patrol) => (
                              <tr
                                key={
                                  patrol.id
                                }
                              >
                                <td>
                                  <strong>
                                    {patrol.property_name ||
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
                                    {patrol.city ||
                                      "-"}
                                  </div>
                                </td>

                                <td>
                                  {formatDate(
                                    patrol.patrol_date
                                  )}
                                </td>

                                <td>
                                  {formatTime(
                                    patrol.check_in
                                  )}
                                </td>

                                <td>
                                  <span
                                    className="badge"
                                    style={getStatusStyle(
                                      patrol.patrol_status
                                    )}
                                  >
                                    {patrol.patrol_status ||
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
            </div>
          </div>

          {/* ================================================= */}
          {/* ASSIGNED PROPERTIES */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  <FaBuilding
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />
                  Assigned Properties
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#777777",
                  }}
                >
                  {assignedProperties.length} properties
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              {assignedProperties.length === 0 ? (
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
                          Status
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

                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#777777",
                                }}
                              >
                                Property ID:{" "}
                                {property.property_id ||
                                  "-"}
                              </div>
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
                                  color:
                                    "#C9A227",
                                }}
                              />

                              {property.city ||
                                "-"}
                            </td>

                            <td>
                              <span
                                className="badge"
                                style={getStatusStyle(
                                  property.assignment_status
                                )}
                              >
                                {property.assignment_status ||
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
        </>
      )}
    </div>
  );
};

export default SecurityDashboard;

