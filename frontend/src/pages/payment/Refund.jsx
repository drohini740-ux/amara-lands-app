import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Refund() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/payments/${id}`);

      setPayment(res.data.payment);
    } catch (error) {
      console.error("Fetch payment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load payment."
      );

      navigate("/payments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please enter refund reason.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/refunds", {
        payment_id: payment.id,
        reason: reason.trim(),
      });

      alert(
        "Refund Request Submitted Successfully"
      );

      navigate("/payments");
    } catch (error) {
      console.error("Refund request error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to submit refund request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading Payment...</h4>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Payment not found.
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/payments")}
        >
          Back to Payments
        </button>
      </div>
    );
  }

  if (payment.payment_status !== "Success") {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Only successful payments can be refunded.
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/payments")}
        >
          Back to Payments
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-danger text-white">
          <h3 className="mb-0">
            Refund Request
          </h3>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Property</th>
                <td>
                  {payment.property_name || "-"}
                </td>
              </tr>

              <tr>
                <th>Amount</th>
                <td>
                  ₹ {payment.amount || 0}
                </td>
              </tr>

              <tr>
                <th>Payment Method</th>
                <td>
                  {payment.payment_method || "-"}
                </td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {payment.payment_status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Transaction ID</th>
                <td>
                  {payment.transaction_id ||
                    payment.razorpay_payment_id ||
                    "-"}
                </td>
              </tr>

            </tbody>

          </table>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label">
                Refund Reason
              </label>

              <textarea
                className="form-control"
                rows="4"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="Enter reason for refund..."
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-danger me-2"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Refund Request"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/payments")}
              disabled={submitting}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}