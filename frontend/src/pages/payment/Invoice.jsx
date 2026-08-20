import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/payments/${id}`);

      setPayment(res.data.payment);
    } catch (error) {
      console.error("Invoice payment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load invoice."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading Invoice...</h4>
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
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            Payment Invoice
          </h3>
        </div>

        <div className="card-body">

          <h4 className="text-center mb-4">
            AMARA LANDS
          </h4>

          <p className="text-center text-muted">
            Payment Invoice
          </p>

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Invoice No</th>
                <td>INV-{payment.id}</td>
              </tr>

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
                <th>Purpose</th>
                <td>
                  {payment.payment_for || "-"}
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
                  <span
                    className={`badge ${
                      payment.payment_status ===
                      "Success"
                        ? "bg-success"
                        : payment.payment_status ===
                          "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {payment.payment_status || "-"}
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

              <tr>
                <th>Payment Date</th>
                <td>
                  {payment.payment_date
                    ? new Date(
                        payment.payment_date
                      ).toLocaleDateString()
                    : "-"}
                </td>
              </tr>

            </tbody>

          </table>

          <div className="mt-4">

            <button
              className="btn btn-success me-2"
              onClick={() => window.print()}
            >
              Print Invoice
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/payments")}
            >
              Back
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}