import { useEffect, useState } from "react";
import {
  FaUsers,
  FaHome,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../../../services/api";

export default function Analytics() {
  const [filter, setFilter] = useState("month");
  const [loading, setLoading] = useState(true);

  // =================================================
  // ANALYTICS DATA
  // =================================================

  const [analyticsData, setAnalyticsData] = useState({
    users: {
      total_users: 0,
      new_users: 0,
      active_users: 0,
      staff_users: 0,
    },

    properties: {
      total_properties: 0,
      verified_properties: 0,
      pending_properties: 0,
      rejected_properties: 0,
    },

    payments: {
      total_payments: 0,
      total_revenue: 0,
      successful_payments: 0,
      pending_payments: 0,
      failed_payments: 0,
    },

    security: {
      security_reports: 0,
      resolved_security_reports: 0,
    },

    appointments: {
      appointments: 0,
      upcoming_appointments: 0,
    },
  });

  // =================================================
  // FETCH ANALYTICS
  // =================================================

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/admin/analytics?filter=${filter}`
      );

      console.log("Analytics API Response:", response.data);

      setAnalyticsData(
        response.data.analytics || {
          users: {},
          properties: {},
          payments: {},
          security: {},
          appointments: {},
        }
      );
    } catch (error) {
      console.error("Analytics error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#1f1f1f",
            }}
          >
            Analytics
          </h2>

          <p className="text-muted mb-0">
            Admin system performance and business analytics
          </p>
        </div>

        {/* FILTER */}

        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "200px",
            border: "2px solid #d4af37",
            fontWeight: "600",
          }}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (
        <div className="text-center py-5">
          <h5>Loading Analytics...</h5>
        </div>
      ) : (
        <>

          {/* ================================================= */}
          {/* USER ANALYTICS */}
          {/* ================================================= */}

          <AnalyticsSection title="User Analytics">

            <AnalyticsCard
              icon={<FaUsers />}
              title="Total Users"
              value={analyticsData.users.total_users || 0}
            />

            <AnalyticsCard
              icon={<FaUsers />}
              title="New Users"
              value={analyticsData.users.new_users || 0}
            />

            <AnalyticsCard
              icon={<FaCheckCircle />}
              title="Active Users"
              value={analyticsData.users.active_users || 0}
            />

            <AnalyticsCard
              icon={<FaUsers />}
              title="Staff Users"
              value={analyticsData.users.staff_users || 0}
            />

          </AnalyticsSection>


          {/* ================================================= */}
          {/* PROPERTY ANALYTICS */}
          {/* ================================================= */}

          <AnalyticsSection title="Property Analytics">

            <AnalyticsCard
              icon={<FaHome />}
              title="Total Properties"
              value={
                analyticsData.properties.total_properties || 0
              }
            />

            <AnalyticsCard
              icon={<FaCheckCircle />}
              title="Verified Properties"
              value={
                analyticsData.properties.verified_properties || 0
              }
            />

            <AnalyticsCard
              icon={<FaClock />}
              title="Pending Verification"
              value={
                analyticsData.properties.pending_properties || 0
              }
            />

            <AnalyticsCard
              icon={<FaTimesCircle />}
              title="Rejected Properties"
              value={
                analyticsData.properties.rejected_properties || 0
              }
            />

          </AnalyticsSection>


          {/* ================================================= */}
          {/* PAYMENT ANALYTICS */}
          {/* ================================================= */}

          <AnalyticsSection title="Payment Analytics">

            <AnalyticsCard
              icon={<FaMoneyBillWave />}
              title="Total Revenue"
              value={`₹${Number(
                analyticsData.payments.total_revenue || 0
              ).toLocaleString()}`}
            />

            <AnalyticsCard
              icon={<FaCreditCard />}
              title="Total Payments"
              value={
                analyticsData.payments.total_payments || 0
              }
            />

            <AnalyticsCard
              icon={<FaCheckCircle />}
              title="Successful Payments"
              value={
                analyticsData.payments.successful_payments || 0
              }
            />

            <AnalyticsCard
              icon={<FaClock />}
              title="Pending Payments"
              value={
                analyticsData.payments.pending_payments || 0
              }
            />

          </AnalyticsSection>


          {/* ================================================= */}
          {/* OPERATIONS ANALYTICS */}
          {/* ================================================= */}

          <AnalyticsSection title="Operations Analytics">

            <AnalyticsCard
              icon={<FaShieldAlt />}
              title="Security Reports"
              value={
                analyticsData.security.security_reports || 0
              }
            />

            <AnalyticsCard
              icon={<FaCheckCircle />}
              title="Resolved Security Reports"
              value={
                analyticsData.security
                  .resolved_security_reports || 0
              }
            />

            <AnalyticsCard
              icon={<FaCalendarAlt />}
              title="Appointments"
              value={
                analyticsData.appointments.appointments || 0
              }
            />

            <AnalyticsCard
              icon={<FaClock />}
              title="Upcoming Appointments"
              value={
                analyticsData.appointments
                  .upcoming_appointments || 0
              }
            />

          </AnalyticsSection>


          {/* ================================================= */}
          {/* ANALYTICS OVERVIEW */}
          {/* ================================================= */}

          <div
            className="card shadow-sm mt-5"
            style={{
              border: "none",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >

            {/* HEADER */}

            <div
              className="card-header"
              style={{
                background: "#1f1f1f",
                color: "#d4af37",
                borderBottom: "2px solid #d4af37",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              Analytics Overview
            </div>

            {/* BODY */}

            <div className="card-body">

              <div className="row g-4">

                {/* PAYMENT PERFORMANCE */}

                <div className="col-md-6">

                  <div
                    className="p-4"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                    }}
                  >

                    <h5
                      style={{
                        fontWeight: "700",
                        color: "#1f1f1f",
                      }}
                    >
                      Payment Performance
                    </h5>

                    <p className="text-muted mb-2">
                      Successful Payments
                    </p>

                    <div
                      className="progress"
                      style={{
                        height: "10px",
                      }}
                    >

                      <div
                        className="progress-bar"
                        style={{
                          width: `${calculatePercentage(
                            analyticsData.payments
                              .successful_payments,
                            analyticsData.payments
                              .total_payments
                          )}%`,
                          background: "#d4af37",
                        }}
                      />

                    </div>

                    <div className="mt-2 fw-bold">

                      {calculatePercentage(
                        analyticsData.payments
                          .successful_payments,
                        analyticsData.payments
                          .total_payments
                      )}
                      %

                    </div>

                  </div>

                </div>


                {/* REVENUE PERFORMANCE */}

                <div className="col-md-6">

                  <div
                    className="p-4"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                    }}
                  >

                    <h5
                      style={{
                        fontWeight: "700",
                        color: "#1f1f1f",
                      }}
                    >
                      Revenue Performance
                    </h5>

                    <p className="text-muted mb-2">
                      Current {getFilterLabel(filter)} Revenue
                    </p>

                    <h2
                      style={{
                        color: "#d4af37",
                        fontWeight: "700",
                      }}
                    >
                      ₹
                      {Number(
                        analyticsData.payments
                          .total_revenue || 0
                      ).toLocaleString()}
                    </h2>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}


/* ================================================= */
/* ANALYTICS SECTION */
/* ================================================= */

function AnalyticsSection({ title, children }) {
  return (
    <div className="mb-5">

      <h4
        className="mb-3"
        style={{
          fontWeight: "700",
          color: "#1f1f1f",
          borderLeft: "5px solid #d4af37",
          paddingLeft: "12px",
        }}
      >
        {title}
      </h4>

      <div className="row g-4">
        {children}
      </div>

    </div>
  );
}


/* ================================================= */
/* ANALYTICS CARD */
/* ================================================= */

function AnalyticsCard({ icon, title, value }) {
  return (
    <div className="col-md-6 col-lg-3">

      <div
        className="card shadow-sm h-100"
        style={{
          background: "#1f1f1f",
          color: "#fff",
          border: "none",
          borderTop: "4px solid #d4af37",
          borderRadius: "12px",
          padding: "20px",
        }}
      >

        <div
          style={{
            color: "#d4af37",
            fontSize: "26px",
            marginBottom: "10px",
          }}
        >
          {icon}
        </div>

        <h6
          style={{
            color: "#d4af37",
            fontWeight: "600",
          }}
        >
          {title}
        </h6>

        <h3
          style={{
            fontWeight: "700",
            marginBottom: 0,
          }}
        >
          {value}
        </h3>

      </div>

    </div>
  );
}


/* ================================================= */
/* CALCULATE PERCENTAGE */
/* ================================================= */

function calculatePercentage(value, total) {
  if (!total || Number(total) === 0) {
    return 0;
  }

  return Math.round(
    (Number(value || 0) / Number(total)) * 100
  );
}


/* ================================================= */
/* FILTER LABEL */
/* ================================================= */

function getFilterLabel(filter) {
  switch (filter) {
    case "today":
      return "Today's";

    case "week":
      return "This Week's";

    case "year":
      return "This Year's";

    default:
      return "This Month's";
  }
}