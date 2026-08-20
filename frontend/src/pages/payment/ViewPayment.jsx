import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaFileInvoice,
} from "react-icons/fa";

export default function ViewPayment() {
  const { id } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PAYMENT
  // ==========================================

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/payments/${id}`);

      setPayment(res.data.payment || null);
    } catch (error) {
      console.error("Get payment error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load payment details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD RECEIPT
  // ==========================================

  const downloadReceipt = async () => {
    if (!payment?.id) {
      return;
    }

    try {
      const response = await api.get(
        `/payments/receipt/${payment.id}`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL =
        window.URL.createObjectURL(file);

      const link =
        document.createElement("a");

      link.href = fileURL;

      link.download = `Receipt-${payment.id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(
        "Receipt download error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to download receipt."
      );
    }
  };

  // ==========================================
  // FORMAT AMOUNT
  // ==========================================

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN");
  };

  // ==========================================
  // STATUS CLASS
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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">

        <div
          className="spinner-border text-warning"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="mt-3 text-muted">
          Loading payment details...
        </p>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !payment) {
    return (
      <div className="container-fluid py-5">

        <div className="card shadow">

          <div className="card-body text-center py-5">

            <h4 className="text-danger">
              Payment Not Found
            </h4>

            <p className="text-muted">
              {error ||
                "Unable to find this payment."}
            </p>

            <Link
              to="/payments"
              className="btn btn-secondary"
            >
              <FaArrowLeft className="me-2" />
              Back to Payments
            </Link>

          </div>

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

          <h2 className="fw-bold mb-1">
            View Payment
          </h2>

          <p className="text-muted mb-0">
            Payment transaction details
          </p>

        </div>

        <Link
          to="/payments"
          className="btn btn-secondary"
        >
          <FaArrowLeft className="me-2" />
          Back to Payments
        </Link>

      </div>

      {/* ==========================================
          PAYMENT DETAILS
      ========================================== */}

      <div className="card shadow">

        {/* CARD HEADER */}

        <div
          className="card-header"
          style={{
            background: "#1f1f1f",
            color: "#d4af37",
          }}
        >

          <div className="d-flex justify-content-between align-items-center">

            <h4 className="mb-0">
              Payment Details
            </h4>

            <span
              className={`badge ${getStatusClass(
                payment.payment_status
              )}`}
            >
              {payment.payment_status || "-"}
            </span>

          </div>

        </div>

        {/* CARD BODY */}

        <div className="card-body">

          <div className="row">

            {/* PROPERTY */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Property
              </small>

              <h6 className="mt-1">
                {payment.property_name || "-"}
              </h6>

            </div>

            {/* AMOUNT */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Amount
              </small>

              <h6 className="mt-1">
                ₹ {formatAmount(payment.amount)}
              </h6>

            </div>

            {/* PURPOSE */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Payment Purpose
              </small>

              <h6 className="mt-1">
                {payment.payment_for || "-"}
              </h6>

            </div>

            {/* PAYMENT METHOD */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Payment Method
              </small>

              <h6 className="mt-1">
                {payment.payment_method || "-"}
              </h6>

            </div>

            {/* TRANSACTION ID */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Transaction ID
              </small>

              <h6 className="mt-1 text-break">
                {payment.transaction_id ||
                  payment.razorpay_payment_id ||
                  "-"}
              </h6>

            </div>

            {/* PAYMENT DATE */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Payment Date
              </small>

              <h6 className="mt-1">
                {formatDate(
                  payment.payment_date
                )}
              </h6>

            </div>

            {/* CREATED DATE */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Created At
              </small>

              <h6 className="mt-1">
                {formatDate(
                  payment.created_at
                )}
              </h6>

            </div>

            {/* REMARKS */}

            <div className="col-md-6 mb-4">

              <small className="text-muted">
                Remarks
              </small>

              <h6 className="mt-1">
                {payment.remarks || "-"}
              </h6>

            </div>

          </div>

          {/* ==========================================
              RAZORPAY DETAILS
          ========================================== */}

          {(payment.razorpay_order_id ||
            payment.razorpay_payment_id) && (

            <div className="border-top pt-4 mt-2">

              <h5 className="mb-3">
                Razorpay Details
              </h5>

              <div className="row">

                {payment.razorpay_order_id && (
                  <div className="col-md-6 mb-3">

                    <small className="text-muted">
                      Razorpay Order ID
                    </small>

                    <div className="text-break">
                      {payment.razorpay_order_id}
                    </div>

                  </div>
                )}

                {payment.razorpay_payment_id && (
                  <div className="col-md-6 mb-3">

                    <small className="text-muted">
                      Razorpay Payment ID
                    </small>

                    <div className="text-break">
                      {payment.razorpay_payment_id}
                    </div>

                  </div>
                )}

              </div>

            </div>

          )}

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="border-top pt-4 mt-3">

            <div className="d-flex gap-2 flex-wrap">

              {/* DOWNLOAD RECEIPT */}

              {payment.payment_status ===
                "Success" && (

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={downloadReceipt}
                >
                  <FaDownload className="me-2" />
                  Download Receipt
                </button>

              )}

              {/* PRINT */}

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <FaPrint className="me-2" />
                Print Payment
              </button>

              {/* INVOICE */}

              {payment.payment_status ===
                "Success" && (

                <Link
                  to={`/payments/invoice/${payment.id}`}
                  className="btn btn-warning"
                >
                  <FaFileInvoice className="me-2" />
                  View Invoice
                </Link>

              )}

              {/* EDIT */}

              <Link
                to={`/payments/edit/${payment.id}`}
                className="btn btn-outline-dark"
              >
                Edit Payment
              </Link>

              {/* BACK */}

              <Link
                to="/payments"
                className="btn btn-secondary"
              >
                <FaArrowLeft className="me-2" />
                Back
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}