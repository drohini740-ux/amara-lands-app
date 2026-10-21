
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

import {
  FaHistory,
  FaSearch,
  FaSyncAlt,
  FaDownload,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoice,
} from "react-icons/fa";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const paymentsPerPage = 5;

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E8E3D5",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  };

  const fetchPayments = useCallback(async () => {
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
      console.error("Fetch Payment History Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load payment history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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

      case "refunded":
        return {
          background: "#E3F2FD",
          color: "#155A8A",
          icon: <FaUndo />,
        };

      case "failed":
        return {
          background: "#FDE8E7",
          color: "#A52722",
          icon: <FaTimesCircle />,
        };

      default:
        return {
          background: "#EEEEEE",
          color: "#444444",
          icon: <FaCreditCard />,
        };
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.trim().toLowerCase();

    const matchSearch =
      !searchText ||
      [
        payment.id,
        payment.property_name,
        payment.payment_method,
        payment.payment_status,
        payment.transaction_id,
        payment.razorpay_payment_id,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

    const matchStatus =
      statusFilter === "All" ||
      getStatus(payment) === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(
    filteredPayments.length / paymentsPerPage
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const currentPayments = filteredPayments.slice(
    (safePage - 1) * paymentsPerPage,
    safePage * paymentsPerPage
  );

  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const successfulCount = payments.filter((payment) =>
    ["success", "successful", "captured", "completed"].includes(
      getStatus(payment)
    )
  ).length;

  const downloadReceipt = async (id) => {
    try {
      setDownloadingId(id);

      const res = await api.get(`/payments/my/receipt/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Receipt-${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Receipt Error:", err);
      window.alert("Unable to download receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background: "#F7F7F5",
        padding: "24px",
        color: "#171717",
      }}
    >
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
            <FaHistory
              className="me-2"
              style={{ color: "#D4AF37" }}
            />
            Payment History
          </h2>

          <p className="text-muted mb-0">
            Review past transactions and download your payment receipts.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/payments" className="btn btn-outline-dark">
            <FaCreditCard className="me-2" />
            All Payments
          </Link>

          <button
            type="button"
            className="btn btn-dark"
            onClick={fetchPayments}
            disabled={loading}
          >
            <FaSyncAlt className="me-2" />
            {loading ? "Loading..." : "Refresh"}
          </button>
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
            onClick={fetchPayments}
            disabled={loading}
          >
            Try Again
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div
            className="p-4 h-100"
            style={{
              ...cardStyle,
              borderTop: "4px solid #D4AF37",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Total Transactions</p>
                <h3 className="fw-bold mb-0">{payments.length}</h3>
              </div>

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "#FFF4CC",
                  color: "#8B6B0B",
                }}
              >
                <FaHistory size={21} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
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

              <FaCheckCircle size={28} style={{ color: "#198754" }} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
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

              <FaCreditCard size={28} style={{ color: "#D4AF37" }} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND STATUS FILTER */}
      <div className="p-3 p-md-4 mb-4" style={cardStyle}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-8">
            <label htmlFor="historySearch" className="form-label fw-semibold">
              Search Transactions
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
                id="historySearch"
                className="form-control"
                placeholder="Search by payment ID, property, method or transaction ID..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <label htmlFor="historyStatus" className="form-label fw-semibold">
              Payment Status
            </label>

            <select
              id="historyStatus"
              className="form-select"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Completed">Completed</option>
              <option value="Captured">Captured</option>
            </select>
          </div>
        </div>
      </div>

      {/* PAYMENT HISTORY TABLE */}
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
            <h5 className="fw-bold mb-1">Transaction Records</h5>
            <p className="small mb-0" style={{ color: "#D0D0D0" }}>
              Payment details and downloadable receipts
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
                <th className="py-3 px-3">Payment ID</th>
                <th className="py-3">Property</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Method</th>
                <th className="py-3">Status</th>
                <th className="py-3">Date</th>
                <th className="py-3 px-3">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      style={{ color: "#D4AF37" }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Loading payment history...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Payment history could not be loaded.
                  </td>
                </tr>
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 px-3">
                    <FaFileInvoice
                      size={40}
                      className="mb-3"
                      style={{ color: "#D4AF37" }}
                    />

                    <h5 className="fw-bold">No Payments Found</h5>

                    <p className="text-muted mb-3">
                      {search || statusFilter !== "All"
                        ? "Try changing your search or status filter."
                        : "Your payment history will appear here."}
                    </p>

                    {(search || statusFilter !== "All") && (
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setCurrentPage(1);
                        }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => {
                  const status = getStatus(payment);
                  const statusStyle = getStatusStyle(status);

                  return (
                    <tr key={payment.id}>
                      <td className="px-3 fw-semibold">
                        #{payment.id}
                      </td>

                      <td>{payment.property_name || "—"}</td>

                      <td className="fw-bold text-nowrap">
                        {formatAmount(payment.amount)}
                      </td>

                      <td>{payment.payment_method || "—"}</td>

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
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            background: "#D4AF37",
                            color: "#111111",
                            fontWeight: 600,
                          }}
                          onClick={() => downloadReceipt(payment.id)}
                          disabled={downloadingId === payment.id}
                          title="Download PDF receipt"
                        >
                          <FaDownload className="me-1" />
                          {downloadingId === payment.id
                            ? "Downloading..."
                            : "Receipt"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3"
          style={{ borderTop: "1px solid #E8E3D5" }}
        >
          <small className="text-muted">
            {filteredPayments.length === 0
              ? "Showing 0 records"
              : `Showing ${
                  (safePage - 1) * paymentsPerPage + 1
                }–${Math.min(
                  safePage * paymentsPerPage,
                  filteredPayments.length
                )} of ${filteredPayments.length} records`}
          </small>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              disabled={safePage === 1 || loading}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              <FaChevronLeft className="me-1" />
              Previous
            </button>

            <span className="fw-semibold small text-nowrap">
              Page {safePage} of {totalPages || 1}
            </span>

            <button
              type="button"
              className="btn btn-dark btn-sm"
              disabled={
                safePage >= totalPages ||
                totalPages === 0 ||
                loading
              }
              onClick={() => setCurrentPage(safePage + 1)}
            >
              Next
              <FaChevronRight className="ms-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
