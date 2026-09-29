import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUsers,
  FaHome,
  FaMoneyBillWave,
  FaGavel,
  FaUserTie,
  FaClipboardCheck,
  FaCalendarAlt,
  FaCreditCard,
  FaChartLine,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

import { fetchSuperAdminDashboard } from "../../redux/superAdminDashboardSlice";

export default function SuperAdminDashboard() {
  const dispatch = useDispatch();

  const {
    data,
    loading,
    error,
  } = useSelector((state) => state.superAdminDashboard);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================
  useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading && !data) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "70vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{
              color: "#D4AF37",
              width: "3rem",
              height: "3rem",
            }}
          ></div>

          <p
            className="mt-3 fw-semibold"
            style={{ color: "#222" }}
          >
            Loading Super Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error && !data) {
    return (
      <div
        className="container-fluid p-4"
        style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <div className="alert alert-danger">
          <strong>Dashboard Error:</strong> {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // DEFAULT DATA
  // =====================================================
  const overview = data?.overview || {};
  const users = data?.users || {};
  const properties = data?.properties || {};
  const appointments = data?.appointments || {};
  const payments = data?.payments || {};

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // DASHBOARD CARDS
  // =====================================================
  const cards = [
    {
      title: "Total Users",
      value: users.total || 0,
      icon: <FaUsers />,
    },
    {
      title: "Total Customers",
      value: users.customers || 0,
      icon: <FaUsers />,
    },
    {
      title: "Total Admins",
      value: users.admins || 0,
      icon: <FaUserShield />,
    },
    {
      title: "Total Staff",
      value:
        (users.field_executives || 0) +
        (users.legal || 0) +
        (users.security || 0),
      icon: <FaUserTie />,
    },
    {
      title: "Total Properties",
      value: properties.total || 0,
      icon: <FaHome />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(overview.total_revenue),
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Total Appointments",
      value: appointments.total || 0,
      icon: <FaCalendarAlt />,
    },
    {
      title: "Pending Approvals",
      value: properties.pending || 0,
      icon: <FaClipboardCheck />,
    },
    {
      title: "Active Staff",
      value: overview.active_staff || 0,
      icon: <FaUserTie />,
    },
    {
      title: "Successful Payments",
      value: payments.successful || 0,
      icon: <FaCreditCard />,
    },
    {
      title: "Pending Payments",
      value: payments.pending || 0,
      icon: <FaCreditCard />,
    },
    {
      title: "Security Users",
      value: users.security || 0,
      icon: <FaShieldAlt />,
    },
  ];

  // =====================================================
  // PROPERTY PERCENTAGE
  // =====================================================
  const totalProperties = properties.total || 0;

  const verifiedPercentage =
    totalProperties > 0
      ? Math.round(
          (properties.verified / totalProperties) * 100
        )
      : 0;

  const pendingPercentage =
    totalProperties > 0
      ? Math.round(
          (properties.pending / totalProperties) * 100
        )
      : 0;

  const rejectedPercentage =
    totalProperties > 0
      ? Math.round(
          (properties.rejected / totalProperties) * 100
        )
      : 0;

  return (
    <div
      className="container-fluid p-4"
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4 rounded"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          borderBottom: "4px solid #D4AF37",
        }}
      >
        <div>
          <h2
            className="fw-bold mb-1"
            style={{ color: "#ffffff" }}
          >
            Super Admin Dashboard
          </h2>

          <p
            className="mb-0"
            style={{ color: "#dddddd" }}
          >
            Welcome to Amara Lands Super Admin Panel
          </p>
        </div>

        <div
          className="px-3 py-2 rounded fw-bold"
          style={{
            backgroundColor: "#D4AF37",
            color: "#000000",
          }}
        >
          SUPER ADMIN
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR WHILE REFRESHING */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* STAT CARDS */}
      {/* ================================================= */}

      <div className="row">
        {cards.map((card, index) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 mb-4"
            key={index}
          >
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                borderTop: "4px solid #D4AF37",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p
                      className="mb-2"
                      style={{
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      {card.title}
                    </p>

                    <h3
                      className="fw-bold mb-0"
                      style={{ color: "#000000" }}
                    >
                      {card.value}
                    </h3>
                  </div>

                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#000000",
                      color: "#D4AF37",
                      fontSize: "22px",
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================= */}
      {/* MAIN SECTIONS */}
      {/* ================================================= */}

      <div className="row">

        {/* ================================================= */}
        {/* PROPERTY VERIFICATION */}
        {/* ================================================= */}

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#000000",
                color: "#D4AF37",
              }}
            >
              <FaHome className="me-2" />
              Property Verification
            </div>

            <div className="card-body">

              {/* Verified */}

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">
                    Verified Properties
                  </span>

                  <span className="fw-bold">
                    {properties.verified || 0}
                  </span>
                </div>

                <div
                  className="progress"
                  style={{ height: "10px" }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${verifiedPercentage}%`,
                      backgroundColor: "#D4AF37",
                    }}
                  ></div>
                </div>
              </div>

              {/* Pending */}

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">
                    Pending Properties
                  </span>

                  <span className="fw-bold">
                    {properties.pending || 0}
                  </span>
                </div>

                <div
                  className="progress"
                  style={{ height: "10px" }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${pendingPercentage}%`,
                      backgroundColor: "#000000",
                    }}
                  ></div>
                </div>
              </div>

              {/* Rejected */}

              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">
                    Rejected Properties
                  </span>

                  <span className="fw-bold">
                    {properties.rejected || 0}
                  </span>
                </div>

                <div
                  className="progress"
                  style={{ height: "10px" }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${rejectedPercentage}%`,
                      backgroundColor: "#555555",
                    }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* APPOINTMENT STATUS */}
        {/* ================================================= */}

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#000000",
                color: "#D4AF37",
              }}
            >
              <FaCalendarAlt className="me-2" />
              Appointment Status
            </div>

            <div className="card-body">

              <div className="row text-center">

                <div className="col-6 mb-4">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <h3 className="fw-bold">
                      {appointments.pending || 0}
                    </h3>

                    <small>Pending</small>
                  </div>
                </div>

                <div className="col-6 mb-4">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <h3 className="fw-bold">
                      {appointments.confirmed || 0}
                    </h3>

                    <small>Confirmed</small>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <h3 className="fw-bold">
                      {appointments.completed || 0}
                    </h3>

                    <small>Completed</small>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <h3 className="fw-bold">
                      {appointments.cancelled || 0}
                    </h3>

                    <small>Cancelled</small>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* USER DISTRIBUTION */}
      {/* ================================================= */}

      <div className="row">

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#000000",
                color: "#D4AF37",
              }}
            >
              <FaUsers className="me-2" />
              User Distribution
            </div>

            <div className="card-body">

              <div className="row text-center">

                <div className="col-6 mb-3">
                  <h4 className="fw-bold">
                    {users.customers || 0}
                  </h4>
                  <small>Customers</small>
                </div>

                <div className="col-6 mb-3">
                  <h4 className="fw-bold">
                    {users.field_executives || 0}
                  </h4>
                  <small>Field Executives</small>
                </div>

                <div className="col-6">
                  <h4 className="fw-bold">
                    {users.legal || 0}
                  </h4>
                  <small>Legal</small>
                </div>

                <div className="col-6">
                  <h4 className="fw-bold">
                    {users.security || 0}
                  </h4>
                  <small>Security</small>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PAYMENT SUMMARY */}
        {/* ================================================= */}

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#000000",
                color: "#D4AF37",
              }}
            >
              <FaCreditCard className="me-2" />
              Payment Summary
            </div>

            <div className="card-body">

              <div className="d-flex justify-content-between border-bottom py-3">
                <span>Total Payments</span>

                <strong>
                  {payments.total || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-3">
                <span>Successful</span>

                <strong>
                  {payments.successful || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-3">
                <span>Pending</span>

                <strong>
                  {payments.pending || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between py-3">
                <span>Failed</span>

                <strong>
                  {payments.failed || 0}
                </strong>
              </div>

              <div
                className="mt-3 p-3 rounded"
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                }}
              >
                <div className="small">
                  Total Revenue
                </div>

                <div
                  className="fs-3 fw-bold"
                  style={{ color: "#D4AF37" }}
                >
                  {formatCurrency(overview.total_revenue)}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* SYSTEM SUMMARY */}
      {/* ================================================= */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderLeft: "5px solid #D4AF37",
        }}
      >
        <div className="card-body">

          <div className="d-flex align-items-center mb-3">
            <FaChartLine
              className="me-2"
              style={{
                color: "#D4AF37",
                fontSize: "22px",
              }}
            />

            <h5 className="fw-bold mb-0">
              System Summary
            </h5>
          </div>

          <div className="row">

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Total Users
              </small>

              <h4 className="fw-bold">
                {overview.total_users || 0}
              </h4>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Total Properties
              </small>

              <h4 className="fw-bold">
                {overview.total_properties || 0}
              </h4>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Total Appointments
              </small>

              <h4 className="fw-bold">
                {overview.total_bookings || 0}
              </h4>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Pending Approvals
              </small>

              <h4
                className="fw-bold"
                style={{ color: "#D4AF37" }}
              >
                {overview.pending_approvals || 0}
              </h4>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}