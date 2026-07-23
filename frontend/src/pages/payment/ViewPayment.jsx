import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function ViewPayment() {
  const { id } = useParams();

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      const res = await api.get(`/payments/${id}`);
      setPayment(res.data.payment);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadReceipt = async () => {
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

      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `Receipt-${payment.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.log(error);
      alert("Unable to download receipt");
    }
  };

  if (!payment) return <h4>Loading...</h4>;

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h3>View Payment</h3>
        </div>

        <div className="card-body">
          <p>
            <strong>Property :</strong> {payment.property_name}
          </p>

          <p>
            <strong>Amount :</strong> ₹ {payment.amount}
          </p>

          <p>
            <strong>Purpose :</strong> {payment.payment_for}
          </p>

          <p>
            <strong>Method :</strong> {payment.payment_method}
          </p>

          <p>
            <strong>Status :</strong>{" "}
            <span
              className={`badge ${
                payment.payment_status === "Success"
                  ? "bg-success"
                  : payment.payment_status === "Pending"
                  ? "bg-warning text-dark"
                  : "bg-danger"
              }`}
            >
              {payment.payment_status}
            </span>
          </p>

          <p>
            <strong>Remarks :</strong> {payment.remarks}
          </p>

          {payment.razorpay_order_id && (
            <>
              <p>
                <strong>Razorpay Order ID :</strong>{" "}
                {payment.razorpay_order_id}
              </p>

              <p>
                <strong>Razorpay Payment ID :</strong>{" "}
                {payment.razorpay_payment_id}
              </p>
            </>
          )}

          <div className="mt-4">
            <button
              className="btn btn-success me-2"
              onClick={downloadReceipt}
            >
              Download Receipt
            </button>

            <button
              className="btn btn-primary me-2"
              onClick={() => window.print()}
            >
              Print Receipt
            </button>

            <Link
              to="/payments"
              className="btn btn-secondary"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}