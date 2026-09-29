
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBalanceScale,
  FaShieldAlt,
  FaUserTie,
  FaSync,
  FaChartBar,
} from "react-icons/fa";

import { fetchSuperAdminReports } from "../../redux/superAdminReportSlice";

const SuperAdminReports = () => {
  const dispatch = useDispatch();

  const {
    data,
    loading,
    error,
  } = useSelector(
    (state) => state.superAdminReport
  );

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchSuperAdminReports());
  }, [dispatch]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchSuperAdminReports());
  };

  // =====================================================
  // SAFE DATA
  // =====================================================

  const overview = data?.overview || {};

  const usersByRole =
    data?.users?.by_role || [];

  const properties =
    data?.properties || {};

  const appointments =
    data?.appointments || {};

  const payments =
    data?.payments || {};

  const paymentStatuses =
    payments?.by_status || [];

  // =====================================================
  // NUMBER FORMAT
  // =====================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // =====================================================
  // CURRENCY FORMAT
  // =====================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================================
  // PERCENTAGE
  // =====================================================

  const getPercentage = (value, total) => {
    if (!total) return 0;

    return Math.round(
      (Number(value || 0) / Number(total)) * 100
    );
  };

  // =====================================================
  // ROLE NAME
  // =====================================================

  const formatRole = (role) => {
    if (!role) return "-";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !data) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{
              color: "#C9A227",
              width: "3rem",
              height: "3rem",
            }}
          />

          <p className="mt-3 mb-0 text-muted">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
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
            Reports & Analytics
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor application-wide performance and
            operational statistics.
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
      {/* OVERVIEW CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* USERS */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Users
                </small>

                <h3 className="mt-2 mb-1">
                  {formatNumber(
                    overview.total_users
                  )}
                </h3>

                <small className="text-success">
                  {formatNumber(
                    overview.active_users
                  )}{" "}
                  active
                </small>
              </div>

              <FaUsers
                style={{
                  color: "#C9A227",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PROPERTIES */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Properties
                </small>

                <h3 className="mt-2 mb-1">
                  {formatNumber(
                    overview.total_properties
                  )}
                </h3>

                <small className="text-success">
                  {formatNumber(
                    overview.verified_properties
                  )}{" "}
                  verified
                </small>
              </div>

              <FaBuilding
                style={{
                  color: "#111111",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PAYMENTS */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Payments
                </small>

                <h3 className="mt-2 mb-1">
                  {formatNumber(
                    overview.total_payments
                  )}
                </h3>

                <small
                  style={{
                    color: "#C9A227",
                  }}
                >
                  {formatCurrency(
                    overview.total_payment_amount
                  )}
                </small>
              </div>

              <FaMoneyBillWave
                style={{
                  color: "#C9A227",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* APPOINTMENTS */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Appointments
                </small>

                <h3 className="mt-2 mb-1">
                  {formatNumber(
                    overview.total_appointments
                  )}
                </h3>

                <small className="text-warning">
                  {formatNumber(
                    appointments.pending
                  )}{" "}
                  pending
                </small>
              </div>

              <FaCalendarCheck
                style={{
                  color: "#111111",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SECONDARY SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* LEGAL */}

        <div className="col-md-4">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="d-flex align-items-center">
              <FaBalanceScale
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
                className="me-3"
              />

              <div>
                <small className="text-muted">
                  Legal Cases
                </small>

                <h4 className="mb-0 mt-1">
                  {formatNumber(
                    overview.total_legal_cases
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY */}

        <div className="col-md-4">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="d-flex align-items-center">
              <FaShieldAlt
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
                className="me-3"
              />

              <div>
                <small className="text-muted">
                  Security Reports
                </small>

                <h4 className="mb-0 mt-1">
                  {formatNumber(
                    overview.total_security_reports
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* STAFF */}

        <div className="col-md-4">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="d-flex align-items-center">
              <FaUserTie
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
                className="me-3"
              />

              <div>
                <small className="text-muted">
                  Staff Assignments
                </small>

                <h4 className="mb-0 mt-1">
                  {formatNumber(
                    overview.total_assignments
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* USERS BY ROLE + PROPERTY STATUS */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* USERS BY ROLE */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex align-items-center">
                <FaChartBar
                  style={{
                    color: "#C9A227",
                  }}
                  className="me-2"
                />

                <strong>
                  Users by Role
                </strong>
              </div>
            </div>

            <div className="card-body">
              {usersByRole.length === 0 ? (
                <p className="text-muted mb-0">
                  No user role data available.
                </p>
              ) : (
                usersByRole.map((item) => {
                  const percentage =
                    getPercentage(
                      item.total,
                      overview.total_users
                    );

                  return (
                    <div
                      key={item.role}
                      className="mb-3"
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span>
                          {formatRole(item.role)}
                        </span>

                        <strong>
                          {item.total}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: "8px",
                          backgroundColor:
                            "#EEEEEE",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor:
                              "#C9A227",
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* PROPERTY STATUS */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <strong>
                Property Status
              </strong>
            </div>

            <div className="card-body">
              <ReportProgress
                label="Verified"
                value={properties.verified}
                total={properties.total}
                percentage={getPercentage(
                  properties.verified,
                  properties.total
                )}
                textColor="#198754"
              />

              <ReportProgress
                label="Pending"
                value={properties.pending}
                total={properties.total}
                percentage={getPercentage(
                  properties.pending,
                  properties.total
                )}
                textColor="#C9A227"
              />

              <ReportProgress
                label="Rejected"
                value={properties.rejected}
                total={properties.total}
                percentage={getPercentage(
                  properties.rejected,
                  properties.total
                )}
                textColor="#DC3545"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* APPOINTMENTS + PAYMENTS */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* APPOINTMENTS */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <strong>
                Appointment Status
              </strong>
            </div>

            <div className="card-body">
              <ReportProgress
                label="Pending"
                value={appointments.pending}
                total={appointments.total}
                percentage={getPercentage(
                  appointments.pending,
                  appointments.total
                )}
                textColor="#C9A227"
              />

              <ReportProgress
                label="Confirmed"
                value={appointments.confirmed}
                total={appointments.total}
                percentage={getPercentage(
                  appointments.confirmed,
                  appointments.total
                )}
                textColor="#0D6EFD"
              />

              <ReportProgress
                label="Completed"
                value={appointments.completed}
                total={appointments.total}
                percentage={getPercentage(
                  appointments.completed,
                  appointments.total
                )}
                textColor="#198754"
              />

              <ReportProgress
                label="Cancelled"
                value={appointments.cancelled}
                total={appointments.total}
                percentage={getPercentage(
                  appointments.cancelled,
                  appointments.total
                )}
                textColor="#DC3545"
              />
            </div>
          </div>
        </div>

        {/* PAYMENTS */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <strong>
                Payment Status
              </strong>
            </div>

            <div className="card-body">
              {paymentStatuses.length === 0 ? (
                <p className="text-muted mb-0">
                  No payment data available.
                </p>
              ) : (
                paymentStatuses.map((item) => {
                  const percentage =
                    getPercentage(
                      item.total,
                      payments.total
                    );

                  return (
                    <div
                      key={
                        item.payment_status
                      }
                      className="mb-4"
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span>
                          {item.payment_status ||
                            "-"}
                        </span>

                        <strong>
                          {item.total}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: "8px",
                          backgroundColor:
                            "#EEEEEE",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor:
                              "#111111",
                            borderRadius: "10px",
                          }}
                        />
                      </div>

                      <small
                        className="text-muted"
                      >
                        Amount:{" "}
                        {formatCurrency(
                          item.amount
                        )}
                      </small>
                    </div>
                  );
                })
              )}

              <div
                className="mt-3 pt-3"
                style={{
                  borderTop:
                    "1px solid #EEEEEE",
                }}
              >
                <div className="d-flex justify-content-between">
                  <span>
                    Total Payment Amount
                  </span>

                  <strong
                    style={{
                      color: "#C9A227",
                    }}
                  >
                    {formatCurrency(
                      payments.total_amount
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FOOTER SUMMARY */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-body"
          style={{
            borderTop:
              "3px solid #C9A227",
          }}
        >
          <div className="row text-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <small className="text-muted">
                Active Users
              </small>

              <h4 className="mt-1 mb-0">
                {formatNumber(
                  overview.active_users
                )}
              </h4>
            </div>

            <div className="col-md-4 mb-3 mb-md-0">
              <small className="text-muted">
                Verified Properties
              </small>

              <h4 className="mt-1 mb-0">
                {formatNumber(
                  overview.verified_properties
                )}
              </h4>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Total Revenue
              </small>

              <h4
                className="mt-1 mb-0"
                style={{
                  color: "#C9A227",
                }}
              >
                {formatCurrency(
                  overview.total_payment_amount
                )}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// REUSABLE PROGRESS COMPONENT
// =====================================================

const ReportProgress = ({
  label,
  value,
  total,
  percentage,
  textColor,
}) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between mb-1">
        <span>{label}</span>

        <strong
          style={{
            color: textColor,
          }}
        >
          {value || 0}
        </strong>
      </div>

      <div
        style={{
          height: "10px",
          backgroundColor: "#EEEEEE",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: textColor,
            borderRadius: "10px",
          }}
        />
      </div>

      <small className="text-muted">
        {percentage}% of {total || 0}
      </small>
    </div>
  );
};

export default SuperAdminReports;

