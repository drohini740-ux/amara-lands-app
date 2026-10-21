
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../redux/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const propertyCards = [
    {
      title: "Total Properties",
      value: data?.totalProperties || 0,
      icon: "🏡",
      description: "All your registered properties",
    },
    {
      title: "Pending Verification",
      value: data?.pendingProperties || 0,
      icon: "⏳",
      description: "Awaiting verification",
    },
    {
      title: "Approved Properties",
      value: data?.approvedProperties || 0,
      icon: "✓",
      description: "Successfully approved",
    },
  ];

  const paymentCards = [
    {
      title: "Total Payments",
      value: formatCurrency(data?.totalPayments),
      description: "Total payment amount",
    },
    {
      title: "Completed Payments",
      value: formatCurrency(data?.completedPayments),
      description: "Successfully completed",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(data?.pendingPayments),
      description: "Awaiting completion",
    },
  ];

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus.includes("approv") ||
        normalizedStatus.includes("verif")) {
      return {
        backgroundColor: "#e8f5e9",
        color: "#23743b",
      };
    }

    if (normalizedStatus.includes("reject") ||
        normalizedStatus.includes("cancel")) {
      return {
        backgroundColor: "#fdeaea",
        color: "#b42318",
      };
    }

    return {
      backgroundColor: "#fff4d6",
      color: "#8a6500",
    };
  };

  if (loading) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="dashboard-panel text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#D4AF37" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0 text-muted">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4 customer-dashboard">
      <style>{`
        .customer-dashboard {
          color: #171717;
          min-height: 100%;
        }

        .dashboard-heading {
          font-weight: 750;
          color: #111111;
          letter-spacing: -0.5px;
        }

        .dashboard-subtitle {
          color: #777777;
          font-size: 14px;
        }

        .dashboard-gold-line {
          width: 58px;
          height: 4px;
          background: #D4AF37;
          border-radius: 5px;
          margin-top: 12px;
        }

        .dashboard-section-title {
          color: #171717;
          font-size: 19px;
          font-weight: 700;
        }

        .dashboard-panel {
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.045);
          overflow: hidden;
        }

        .dashboard-stat-card {
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.045);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
        }

        .dashboard-stat-top {
          height: 4px;
          background: #D4AF37;
          border-radius: 14px 14px 0 0;
        }

        .dashboard-stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #fff8e5;
          color: #997515;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .dashboard-stat-title {
          color: #777777;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .dashboard-stat-value {
          color: #111111;
          font-size: clamp(23px, 2.5vw, 30px);
          font-weight: 750;
          overflow-wrap: anywhere;
          margin-bottom: 8px;
        }

        .dashboard-stat-description {
          color: #888888;
          font-size: 12px;
          margin-bottom: 0;
        }

        .dashboard-payment-card {
          height: 100%;
          padding: 22px;
          border-radius: 14px;
          background: #111111;
          color: #FFFFFF;
          border: 1px solid #242424;
          position: relative;
          overflow: hidden;
        }

        .dashboard-payment-card::after {
          content: "";
          position: absolute;
          width: 90px;
          height: 90px;
          right: -35px;
          top: -35px;
          border: 15px solid rgba(212, 175, 55, 0.12);
          border-radius: 50%;
        }

        .dashboard-payment-title {
          color: #d4d4d4;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .dashboard-payment-value {
          color: #D4AF37;
          font-size: clamp(20px, 2vw, 27px);
          font-weight: 750;
          overflow-wrap: anywhere;
          margin-bottom: 9px;
        }

        .dashboard-payment-description {
          color: #bcbcbc;
          font-size: 12px;
          margin-bottom: 0;
        }

        .dashboard-table thead th {
          background: #111111;
          color: #D4AF37;
          border-bottom: 2px solid #D4AF37;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          white-space: nowrap;
          padding: 15px;
        }

        .dashboard-table tbody td {
          padding: 15px;
          vertical-align: middle;
          font-size: 13px;
          color: #444444;
          border-color: #eeeeee;
        }

        .dashboard-table tbody tr:hover td {
          background: #fffcf3;
        }

        .dashboard-property-name {
          color: #171717;
          font-weight: 650;
        }

        .dashboard-status {
          display: inline-block;
          border-radius: 20px;
          padding: 6px 11px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .dashboard-table-empty {
          padding: 36px 15px !important;
          text-align: center;
          color: #888888 !important;
        }

        @media (max-width: 576px) {
          .dashboard-payment-card {
            padding: 18px;
          }

          .dashboard-table thead th,
          .dashboard-table tbody td {
            padding: 12px;
          }
        }
      `}</style>

      {/* Dashboard heading */}
      <div className="mb-4">
        <p
          className="mb-2 text-uppercase fw-bold"
          style={{
            color: "#A78319",
            fontSize: "11px",
            letterSpacing: "1.8px",
          }}
        >
          AMARA LANDS
        </p>

        <h2 className="dashboard-heading mb-2">
          Customer Dashboard
        </h2>

        <p className="dashboard-subtitle mb-0">
          Overview of your properties and payments.
        </p>

        <div className="dashboard-gold-line" />
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {typeof error === "string"
            ? error
            : error?.message || "Unable to load dashboard information."}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => dispatch(fetchDashboard())}
          >
            Retry
          </button>
        </div>
      )}

      {/* Property summary */}
      <section className="mb-5">
        <h5 className="dashboard-section-title mb-3">
          Property Summary
        </h5>

        <div className="row g-3 g-xl-4">
          {propertyCards.map((card) => (
            <div className="col-12 col-md-6 col-xl-4" key={card.title}>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-top" />

                <div className="p-3 p-lg-4">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="flex-grow-1">
                      <p className="dashboard-stat-title">
                        {card.title}
                      </p>
                      <h3 className="dashboard-stat-value">
                        {card.value}
                      </h3>
                    </div>

                    <div className="dashboard-stat-icon">
                      {card.icon}
                    </div>
                  </div>

                  <p className="dashboard-stat-description">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment overview */}
      <section className="mb-5">
        <h5 className="dashboard-section-title mb-3">
          Payment Overview
        </h5>

        <div className="row g-3 g-xl-4">
          {paymentCards.map((card) => (
            <div className="col-12 col-md-6 col-xl-4" key={card.title}>
              <div className="dashboard-payment-card">
                <p className="dashboard-payment-title">
                  {card.title}
                </p>

                <h3 className="dashboard-payment-value">
                  {card.value}
                </h3>

                <p className="dashboard-payment-description">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent properties */}
      <section className="dashboard-panel">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 p-md-4 border-bottom">
          <div>
            <h5 className="mb-1 fw-bold">Recent Properties</h5>
            <p className="dashboard-subtitle mb-0">
              Your recently registered properties
            </p>
          </div>

          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              backgroundColor: "#fff4d6",
              color: "#8a6500",
              border: "1px solid #f0d98c",
            }}
          >
            {data?.recentProperties?.length || 0} Records
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 dashboard-table">
            <thead>
              <tr>
                <th>Property Name</th>
                <th>City</th>
                <th>State</th>
                <th>Verification Status</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentProperties?.length > 0 ? (
                data.recentProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="dashboard-property-name">
                      {property.property_name || "—"}
                    </td>

                    <td>{property.city || "—"}</td>

                    <td>{property.state || "—"}</td>

                    <td>
                      <span
                        className="dashboard-status"
                        style={getStatusStyle(
                          property.verification_status
                        )}
                      >
                        {property.verification_status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="dashboard-table-empty">
                    <div className="mb-2" style={{ fontSize: "28px" }}>
                      🏡
                    </div>
                    <strong>No properties found</strong>
                    <p className="small mb-0 mt-1">
                      Your registered properties will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
