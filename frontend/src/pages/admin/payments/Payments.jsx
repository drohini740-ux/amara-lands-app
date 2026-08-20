import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Link } from "react-router-dom";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ==========================================
  // Fetch All Admin Payments
  // ==========================================
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/payments");

      setPayments(res.data.payments || []);
    } catch (error) {
      console.error("Admin payments error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to fetch payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ==========================================
  // Search + Status Filter
  // ==========================================
  const filteredPayments = payments.filter((payment) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      payment.property_name
        ?.toLowerCase()
        .includes(searchValue) ||
      payment.full_name
        ?.toLowerCase()
        .includes(searchValue) ||
      payment.email
        ?.toLowerCase()
        .includes(searchValue) ||
      payment.payment_method
        ?.toLowerCase()
        .includes(searchValue) ||
      payment.payment_status
        ?.toLowerCase()
        .includes(searchValue) ||
      payment.transaction_id
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      payment.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // Status Badge
  // ==========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "Success":
        return "bg-success";

      case "Pending":
        return "bg-warning text-dark";

      case "Failed":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  // ==========================================
  // Download Receipt
  // ==========================================
  const downloadReceipt = async (id) => {
    try {
      const response = await api.get(
        `/payments/receipt/${id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `Receipt-${id}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Receipt download error:",
        error
      );

      alert("Unable to download receipt.");
    }
  };

  return (
    <div className="container-fluid">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="payment-title mb-1">
            All Payments
          </h2>

          <p className="text-muted mb-0">
            View and manage all customer payments
          </p>
        </div>

        <Link
          to="/admin/payment-dashboard"
          className="btn btn-dark"
        >
          ← Payment Dashboard
        </Link>

      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}
      <div className="payment-table-card mb-4">

        <div className="row g-3">

          {/* Search */}
          <div className="col-md-8">

            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search property, customer, email, method, transaction..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                border: "2px solid #d4af37",
                borderRadius: "10px",
              }}
            />

          </div>

          {/* Status */}
          <div className="col-md-4">

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                border: "2px solid #d4af37",
                fontWeight: "600",
              }}
            >
              <option value="all">
                All Status
              </option>

              <option value="Success">
                Success
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* ==========================================
          PAYMENT TABLE
      ========================================== */}
      <div className="payment-table-card">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h4 className="mb-0">
            Payment Records
          </h4>

          <span className="badge bg-dark fs-6">
            {filteredPayments.length} Payments
          </span>

        </div>

        {loading ? (

          <div className="text-center py-5">

            <div
              className="spinner-border"
              role="status"
            />

            <p className="mt-2">
              Loading payments...
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Payment For</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredPayments.length > 0 ? (

                  filteredPayments.map((payment) => (

                    <tr key={payment.id}>

                      <td>
                        #{payment.id}
                      </td>

                      <td>

                        <strong>
                          {payment.full_name || "-"}
                        </strong>

                        <br />

                        <small className="text-muted">
                          {payment.email || "-"}
                        </small>

                      </td>

                      <td>
                        {payment.property_name || "-"}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            payment.amount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        {payment.payment_for || "-"}
                      </td>

                      <td>
                        {payment.payment_method || "-"}
                      </td>

                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            payment.payment_status
                          )}`}
                        >
                          {payment.payment_status}
                        </span>

                      </td>

                      <td>
                        {payment.created_at
                          ? new Date(
                              payment.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() =>
                              setSelectedPayment(
                                payment
                              )
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#paymentDetailsModal"
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm"
                            style={{
                              background: "#d4af37",
                              color: "#fff",
                              fontWeight: "600",
                            }}
                            onClick={() =>
                              downloadReceipt(
                                payment.id
                              )
                            }
                          >
                            Receipt
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >
                      No payments found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==========================================
          PAYMENT DETAILS MODAL
      ========================================== */}
      <div
        className="modal fade"
        id="paymentDetailsModal"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-lg modal-dialog-centered">

          <div className="modal-content">

            <div
              className="modal-header"
              style={{
                background: "#1f1f1f",
                color: "#d4af37",
                borderBottom:
                  "2px solid #d4af37",
              }}
            >

              <h5 className="modal-title">
                Payment Details
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />

            </div>

            <div
              className="modal-body"
              style={{
                background: "#222",
                color: "#fff",
              }}
            >

              {selectedPayment && (

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment ID
                    </strong>

                    <br />

                    #{selectedPayment.id}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Customer
                    </strong>

                    <br />

                    {selectedPayment.full_name ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Email
                    </strong>

                    <br />

                    {selectedPayment.email || "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Property
                    </strong>

                    <br />

                    {selectedPayment.property_name ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Amount
                    </strong>

                    <br />

                    ₹
                    {Number(
                      selectedPayment.amount || 0
                    ).toLocaleString("en-IN")}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment For
                    </strong>

                    <br />

                    {selectedPayment.payment_for ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment Method
                    </strong>

                    <br />

                    {selectedPayment.payment_method ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Status
                    </strong>

                    <br />

                    <span
                      className={`badge ${getStatusClass(
                        selectedPayment.payment_status
                      )}`}
                    >
                      {selectedPayment.payment_status}
                    </span>
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Transaction ID
                    </strong>

                    <br />

                    {selectedPayment.transaction_id ||
                      selectedPayment.razorpay_payment_id ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment Date
                    </strong>

                    <br />

                    {selectedPayment.payment_date
                      ? new Date(
                          selectedPayment.payment_date
                        ).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Razorpay Order ID
                    </strong>

                    <br />

                    {selectedPayment.razorpay_order_id ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Created At
                    </strong>

                    <br />

                    {selectedPayment.created_at
                      ? new Date(
                          selectedPayment.created_at
                        ).toLocaleString()
                      : "-"}
                  </div>

                  <div className="col-12 mb-3">
                    <strong>
                      Remarks
                    </strong>

                    <br />

                    {selectedPayment.remarks || "-"}
                  </div>

                </div>

              )}

            </div>

            <div
              className="modal-footer"
              style={{
                background: "#1f1f1f",
                borderTop:
                  "2px solid #d4af37",
              }}
            >

              {selectedPayment && (
                <button
                  className="btn"
                  style={{
                    background: "#d4af37",
                    color: "#fff",
                    fontWeight: "600",
                  }}
                  onClick={() =>
                    downloadReceipt(
                      selectedPayment.id
                    )
                  }
                >
                  📄 Download Receipt
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}