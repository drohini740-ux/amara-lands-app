import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/paymentSlice";

export default function Refund() {

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { payments } = useSelector((state) => state.payment);

  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const payment = payments.find((item) => item.id === Number(id));

  if (!payment) {
    return (
      <div className="container mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  const handleSubmit = (e) => {

    e.preventDefault();

    alert("Refund Request Submitted Successfully");

    navigate("/payments");

  };

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-danger text-white">

          <h3>Refund Request</h3>

        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>

                <th>Property</th>

                <td>{payment.property_name}</td>

              </tr>

              <tr>

                <th>Amount</th>

                <td>₹ {payment.amount}</td>

              </tr>

              <tr>

                <th>Payment Method</th>

                <td>{payment.payment_method}</td>

              </tr>

              <tr>

                <th>Status</th>

                <td>{payment.payment_status}</td>

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
                onChange={(e) => setReason(e.target.value)}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-danger me-2"
            >
              Submit Refund Request
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/payments")}
            >
              Cancel
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}