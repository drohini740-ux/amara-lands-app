
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaFileInvoice,
  FaUndo,
  FaHistory,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments belonging to the logged-in customer.
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/payments/my");

      setPayments(
        Array.isArray(res.data?.payments)
          ? res.data.payments
          : []
      );
    } catch (err) {
      console.error("Fetch Customer Payments Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load payments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Search payment records.
  const searchValue = search.toLowerCase().trim();

  const filteredPayments = payments.filter((payment) =>
    [
      payment.property_name,
      payment.payment_for,
      payment.payment_method,
      payment.payment_status,
      payment.transaction_id,
      payment.razorpay_payment_id,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchValue)
    )
  );

  // Normalize status labels.
  const getStatus = (payment) =>
    String(payment.payment_status || "Unknown").toLowerCase();

  const getStatusStyle = (status) => {
    switch (status) {
      case "success":
      case "successful":
      case "captured":
      case "completed":
        return {
          background: "#E7F6EC",
          color: "#176B35",
          icon: <FaCheckCircle />,
        };

      case "pending":
        return {
          background: "#FFF4CC",
          color: "#795900",
          icon: <FaClock />,
        };

      case "failed":
        return {
          background: "#FDE8E7",
          color: "#A52722",
          icon: <FaTimesCircle />,
        };

      case "refunded":
        return {
          background: "#E3F2FD",
          color: "#155A8A",
          icon: <FaUndo />,
        };

      default:
        return {
          background: "#EEEEEE",
          color: "#444444",
          icon: <FaCreditCard />,
        };
    }
  };

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "-"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const successfulCount = payments.filter((payment) =>
    ["success", "successful", "captured", "completed"].includes(
      getStatus(payment)
    )
  ).length;

  const pendingCount = payments.filter(
    (payment) => getStatus(payment) === "pending"
  ).length;

  const pageStyle = {
    minHeight: "100vh",
    background: "#F7F7F5",
    padding: "24px",
    color: "#171717",
  };

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E8E3D5",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  };

  const primaryButtonStyle = {
    background: "#D4AF37",
    color: "#111111",
    border: "1px solid #D4AF37",
    fontWeight: 600,
    borderRadius: "8px",
    padding: "10px 15px",
    textDecoration: "none",
  };

  if (loading) {
    return (
      <div
        style={pageStyle}
        className="container-fluid d-flex justify-content-center align-items-center"
      >
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#D4AF37", width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <h5 className="mt-3 fw-semibold">Loading Payments</h5>
          <p className="text-muted mb-0">
            Please wait while we retrieve your payment records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle} className="container-fluid">
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div
            className="small fw-bold text-uppercase mb-2"
            style={{ color: "#9B7B16", letterSpacing: "2px" }}
          >
            AMARA LANDS / CUSTOMER PORTAL
          </div>

          <h2 className="fw-bold mb-2" style={{ color: "#111111" }}>
            Payment Management
          </h2>

          <p className="text-muted mb-0">
            Track your payments, invoices, and refund requests.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/payments/history" className="btn btn-dark">
            <FaHistory className="me-2" />
            Payment History
          </Link>

          <Link to="/payments/add" style={primaryButtonStyle}>
            <FaPlus className="me-2" />
            Add Payment
          </Link>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          className="alert d-flex justify-content-between align-items-center flex-wrap gap-2"
          role="alert"
          style={{
            background: "#FDE8E7",
            color: "#842029",
            border: "1px solid #F5C2C7",
            borderRadius: "10px",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={loadPayments}
          >
            <FaSyncAlt className="me-2" />
            Try Again
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div
            className="p-4 h-100"
            style={{
              ...cardStyle,
              borderTop: "4px solid #D4AF37",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Total Payments</p>
                <h3 className="fw-bold mb-0">{payments.length}</h3>
              </div>

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: "#FFF4CC",
                  color: "#8B6B0B",
                  width: "52px",
                  height: "52px",
                }}
              >
                <FaCreditCard size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div
            className="p-4 h-100"
            style={{
              ...cardStyle,
              borderTop: "4px solid #198754",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Successful Payments</p>
                <h3 className="fw-bold mb-0">{successfulCount}</h3>
              </div>

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: "#E7F6EC",
                  color: "#176B35",
                  width: "52px",
                  height: "52px",
                }}
              >
                <FaCheckCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div
            className="p-4 h-100"
            style={{
              ...cardStyle,
              borderTop: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Total Amount Recorded</p>
                <h3 className="fw-bold mb-0">
                  {formatAmount(totalAmount)}
                </h3>
              </div>

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: "#F0E8CA",
                  color: "#806511",
                  width: "52px",
                  height: "52px",
                }}
              >
                <FaCreditCard size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="p-3 p-md-4 mb-4" style={cardStyle}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-8">
            <label
              htmlFor="paymentSearch"
              className="form-label fw-semibold"
            >
              Search Payments
            </label>

            <div className="input-group">
              <span
                className="input-group-text"
                style={{
                  background: "#FFF9E8",
                  borderColor: "#E8DCA9",
                }}
              >
                <FaSearch style={{ color: "#8B6B0B" }} />
              </span>

              <input
                id="paymentSearch"
                type="text"
                className="form-control"
                placeholder="Search property, purpose, method, status or transaction ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4 d-flex align-items-end justify-content-lg-end gap-2">
            {search && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}

            <button
              type="button"
              className="btn btn-dark"
              onClick={loadPayments}
              disabled={loading}
            >
              <FaSyncAlt className="me-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
          <span>
            <FaCreditCard className="me-2" />
            {payments.length} total records
          </span>

          <span>
            <FaCheckCircle className="me-2 text-success" />
            {successfulCount} successful
          </span>

          <span>
            <FaClock className="me-2" style={{ color: "#9B7B16" }} />
            {pendingCount} pending
          </span>
        </div>
      </div>

      {/* PAYMENT TABLE */}
      <div style={cardStyle} className="overflow-hidden">
        <div
          className="p-3 p-md-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
          style={{
            background: "#111111",
            color: "#FFFFFF",
            borderBottom: "3px solid #D4AF37",
          }}
        >
          <div>
            <h5 className="fw-bold mb-1">Payment Records</h5>
            <p className="small mb-0" style={{ color: "#D0D0D0" }}>
              Your payment details and available actions
            </p>
          </div>

          <span
            className="badge rounded-pill px-3 py-2"
            style={{ background: "#D4AF37", color: "#111111" }}
          >
            {filteredPayments.length} record
            {filteredPayments.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr style={{ background: "#F5F0DF" }}>
                <th className="py-3 px-3">Property</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Purpose</th>
                <th className="py-3">Method</th>
                <th className="py-3">Status</th>
                <th className="py-3">Payment Date</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {error ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Unable to retrieve your payments. Please try again.
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const status = getStatus(payment);
                  const statusStyle = getStatusStyle(status);

                  return (
                    <tr key={payment.id}>
                      <td className="px-3">
                        <div className="fw-semibold">
                          {payment.property_name || "Property payment"}
                        </div>
                        <small className="text-muted">
                          Payment ID: {payment.id}
                        </small>
                      </td>

                      <td className="fw-bold text-nowrap">
                        {formatAmount(payment.amount)}
                      </td>

                      <td>{payment.payment_for || "-"}</td>

                      <td>{payment.payment_method || "-"}</td>

                      <td>
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            background: statusStyle.background,
                            color: statusStyle.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span className="me-1">{statusStyle.icon}</span>
                          {payment.payment_status || "Unknown"}
                        </span>
                      </td>

                      <td className="text-nowrap">
                        {formatDate(
                          payment.payment_date || payment.created_at
                        )}
                      </td>

                      <td className="px-3">
                        <div className="d-flex gap-2">
                          <Link
                            to={`/payments/view/${payment.id}`}
                            className="btn btn-sm"
                            style={{
                              background: "#111111",
                              color: "#FFFFFF",
                            }}
                            title="View Payment"
                            aria-label={`View payment ${payment.id}`}
                          >
                            <FaEye />
                          </Link>

                          {[
                            "success",
                            "successful",
                            "captured",
                            "completed",
                          ].includes(status) && (
                            <>
                              <Link
                                to={`/payments/invoice/${payment.id}`}
                                className="btn btn-sm"
                                style={{
                                  background: "#D4AF37",
                                  color: "#111111",
                                }}
                                title="View Invoice"
                                aria-label={`View invoice for payment ${payment.id}`}
                              >
                                <FaFileInvoice />
                              </Link>

                              <Link
                                to={`/payments/refund/${payment.id}`}
                                className="btn btn-outline-secondary btn-sm"
                                title="Request Refund"
                                aria-label={`Request refund for payment ${payment.id}`}
                              >
                                <FaUndo />
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 px-3">
                    <FaFileInvoice
                      size={42}
                      className="mb-3"
                      style={{ color: "#D4AF37" }}
                    />

                    <h5 className="fw-bold">No Payments Found</h5>

                    <p className="text-muted mb-3">
                      {search
                        ? "No payments match your search. Try another keyword."
                        : "You don't have any payments yet."}
                    </p>

                    {search ? (
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setSearch("")}
                      >
                        Clear Search
                      </button>
                    ) : (
                      <Link
                        to="/payments/add"
                        className="btn btn-sm"
                        style={primaryButtonStyle}
                      >
                        <FaPlus className="me-2" />
                        Add Payment
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="small text-muted mt-3 mb-0">
        Payment information is retrieved from your authenticated customer account.
      </p>
    </div>
  );
}
