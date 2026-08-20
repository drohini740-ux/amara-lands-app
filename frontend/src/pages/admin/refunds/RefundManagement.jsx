import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

export default function RefundManagement() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);

  const [remarks, setRemarks] = useState("");

  const [processingId, setProcessingId] = useState(null);

  // ==========================================
  // FETCH REFUND REQUESTS
  // ==========================================
  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/refunds");

      setRefunds(res.data.refunds || []);
    } catch (error) {
      console.error("Fetch refunds error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load refund requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT REFUND
  // ==========================================
  const handleView = (refund) => {
    setSelectedRefund(refund);
    setRemarks("");
  };

  // ==========================================
  // APPROVE REFUND
  // ==========================================
  const handleApprove = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this refund?"
    );

    if (!confirmApprove) return;

    try {
      setProcessingId(id);

      const res = await api.put(
        `/admin/refunds/${id}/approve`,
        {
          admin_remarks:
            remarks || "Refund approved by admin.",
        }
      );

      alert(
        res.data.message ||
          "Refund approved successfully."
      );

      setSelectedRefund(null);

      await fetchRefunds();
    } catch (error) {
      console.error("Approve refund error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to approve refund."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // REJECT REFUND
  // ==========================================
  const handleReject = async (id) => {
    if (!remarks.trim()) {
      alert(
        "Please enter admin remarks before rejecting the refund."
      );
      return;
    }

    const confirmReject = window.confirm(
      "Are you sure you want to reject this refund?"
    );

    if (!confirmReject) return;

    try {
      setProcessingId(id);

      const res = await api.put(
        `/admin/refunds/${id}/reject`,
        {
          admin_remarks: remarks,
        }
      );

      alert(
        res.data.message ||
          "Refund rejected successfully."
      );

      setSelectedRefund(null);

      await fetchRefunds();
    } catch (error) {
      console.error("Reject refund error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to reject refund."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success";

      case "Rejected":
        return "bg-danger";

      case "Pending":
      default:
        return "bg-warning text-dark";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <h4>Loading Refund Requests...</h4>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="container-fluid">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            Refund Management
          </h2>

          <p className="text-muted mb-0">
            Manage customer refund requests
          </p>
        </div>

        <Link
          to="/admin/payments"
          className="btn btn-dark"
        >
          Back to Payments
        </Link>

      </div>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Total Requests
              </h6>

              <h2 className="fw-bold">
                {refunds.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Pending Requests
              </h6>

              <h2 className="fw-bold text-warning">
                {
                  refunds.filter(
                    (refund) =>
                      refund.status === "Pending"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Approved Requests
              </h6>

              <h2 className="fw-bold text-success">
                {
                  refunds.filter(
                    (refund) =>
                      refund.status === "Approved"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ==========================================
          REFUND TABLE
      ========================================== */}

      <div className="card shadow">

        <div className="card-header">
          <h5 className="mb-0">
            Refund Requests
          </h5>
        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Payment</th>
                <th>Refund Amount</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {refunds.length > 0 ? (

                refunds.map((refund) => (

                  <tr key={refund.id}>

                    <td>
                      #{refund.id}
                    </td>

                    <td>
                      <strong>
                        {refund.full_name || "-"}
                      </strong>

                      <br />

                      <small className="text-muted">
                        {refund.email || "-"}
                      </small>
                    </td>

                    <td>
                      {refund.property_name || "-"}
                    </td>

                    <td>
                      ₹{refund.payment_amount || 0}
                    </td>

                    <td>
                      <strong>
                        ₹{refund.refund_amount || 0}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          refund.status
                        )}`}
                      >
                        {refund.status}
                      </span>
                    </td>

                    <td>
                      {refund.requested_at
                        ? new Date(
                            refund.requested_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td>

                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleView(refund)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-4"
                  >
                    No refund requests found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          REFUND DETAILS MODAL
      ========================================== */}

      {selectedRefund && (

        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor:
              "rgba(0,0,0,0.6)",
          }}
        >

          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

              {/* HEADER */}

              <div className="modal-header bg-dark text-white">

                <h5 className="modal-title">
                  Refund Request #{selectedRefund.id}
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setSelectedRefund(null)
                  }
                />

              </div>

              {/* BODY */}

              <div className="modal-body">

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <strong>
                      Customer
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.full_name ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Email
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.email ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Property
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.property_name ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Payment ID
                    </strong>

                    <p className="mb-0">
                      #{selectedRefund.payment_id}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Payment Amount
                    </strong>

                    <p className="mb-0">
                      ₹
                      {selectedRefund.payment_amount ||
                        0}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Refund Amount
                    </strong>

                    <p className="mb-0 fw-bold">
                      ₹
                      {selectedRefund.refund_amount ||
                        0}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Payment Method
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.payment_method ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Payment Status
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.payment_status ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Razorpay Payment ID
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.razorpay_payment_id ||
                        "-"}
                    </p>

                  </div>

                  <div className="col-md-6 mb-3">

                    <strong>
                      Requested Date
                    </strong>

                    <p className="mb-0">
                      {selectedRefund.requested_at
                        ? new Date(
                            selectedRefund.requested_at
                          ).toLocaleString()
                        : "-"}
                    </p>

                  </div>

                  <div className="col-12 mb-3">

                    <strong>
                      Customer Reason
                    </strong>

                    <div className="border rounded p-3 mt-2 bg-light">
                      {selectedRefund.reason ||
                        "-"}
                    </div>

                  </div>

                  <div className="col-12 mb-3">

                    <label className="form-label fw-bold">
                      Admin Remarks
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter remarks..."
                      value={remarks}
                      onChange={(e) =>
                        setRemarks(
                          e.target.value
                        )
                      }
                      disabled={
                        selectedRefund.status !==
                          "Pending" ||
                        processingId ===
                          selectedRefund.id
                      }
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="modal-footer">

                {selectedRefund.status ===
                  "Pending" && (

                  <>

                    <button
                      className="btn btn-success"
                      disabled={
                        processingId ===
                        selectedRefund.id
                      }
                      onClick={() =>
                        handleApprove(
                          selectedRefund.id
                        )
                      }
                    >
                      {processingId ===
                      selectedRefund.id
                        ? "Processing..."
                        : "Approve Refund"}
                    </button>

                    <button
                      className="btn btn-danger"
                      disabled={
                        processingId ===
                        selectedRefund.id
                      }
                      onClick={() =>
                        handleReject(
                          selectedRefund.id
                        )
                      }
                    >
                      Reject Refund
                    </button>

                  </>

                )}

                {selectedRefund.status ===
                  "Approved" && (

                  <span className="badge bg-success fs-6">
                    Refund Approved
                  </span>

                )}

                {selectedRefund.status ===
                  "Rejected" && (

                  <span className="badge bg-danger fs-6">
                    Refund Rejected
                  </span>

                )}

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setSelectedRefund(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}