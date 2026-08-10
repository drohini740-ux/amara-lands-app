import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/paymentSlice";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { payments } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const payment = payments.find((item) => item.id === Number(id));

  if (!payment) {
    return (
      <div className="container mt-5">
        <h4>Loading Invoice...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Payment Invoice</h3>
        </div>

        <div className="card-body">

          <h4 className="text-center mb-4">AMARA LANDS</h4>

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Invoice No</th>
                <td>INV-{payment.id}</td>
              </tr>

              <tr>
                <th>Property</th>
                <td>{payment.property_name}</td>
              </tr>

              <tr>
                <th>Amount</th>
                <td>₹ {payment.amount}</td>
              </tr>

              <tr>
                <th>Purpose</th>
                <td>{payment.payment_for}</td>
              </tr>

              <tr>
                <th>Payment Method</th>
                <td>{payment.payment_method}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{payment.payment_status}</td>
              </tr>

              <tr>
                <th>Transaction ID</th>
                <td>{payment.transaction_id || "-"}</td>
              </tr>

              <tr>
                <th>Payment Date</th>
                <td>
                  {payment.payment_date
                    ? payment.payment_date.substring(0, 10)
                    : "-"}
                </td>
              </tr>

            </tbody>

          </table>

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
  );
}