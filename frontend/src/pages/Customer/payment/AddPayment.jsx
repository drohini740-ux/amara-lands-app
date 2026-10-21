
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import * as paymentService from "../../../services/paymentService";

export default function AddPayment() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState("");

  const [formData, setFormData] = useState({
    property_id: "",
    amount: "",
    payment_for: "",
    remarks: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setPropertiesError("");

      const res = await api.get("/properties");
      setProperties(res.data.properties || []);
    } catch (error) {
      console.error("Fetch Properties Error:", error);
      setPropertiesError("Unable to load your properties. Please refresh.");
    }
  };

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (loading) return;

    const amount = Number(formData.amount);

    if (!formData.property_id) {
      alert("Please select a property.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (!formData.payment_for.trim()) {
      alert("Please enter the payment purpose.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      // The backend creates the Razorpay order AND the Pending DB record.
      const orderResponse = await paymentService.createOrder({
        property_id: Number(formData.property_id),
        amount,
        payment_for: formData.payment_for.trim(),
        remarks: formData.remarks.trim(),
      });

      const { order, payment } = orderResponse.data;

      if (!order?.id || !payment?.id) {
        throw new Error("The server did not return the payment details.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Amara Lands",
        description: formData.payment_for.trim(),
        order_id: order.id,

        // Avoid hardcoded customer contact details.
        handler: async (razorpayResponse) => {
          try {
            await paymentService.verifyPayment({
              payment_id: payment.id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            alert("Payment successful!");
            navigate("/payments");
          } catch (error) {
            console.error("Payment Verification Error:", error);

            alert(
              "Payment verification could not be completed. " +
              "Please check Payment History before trying again."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#D4AF37",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay Payment Failed:", response.error);
        setLoading(false);
        alert("Payment failed. Please check Payment History before retrying.");
      });

      razorpay.open();
    } catch (error) {
      console.error("Create Payment Error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to start the payment."
      );

      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h3>Add Payment</h3>
        </div>

        <div className="card-body">
          {propertiesError && (
            <div className="alert alert-danger">{propertiesError}</div>
          )}

          <form onSubmit={handlePayment}>
            <div className="mb-3">
              <label htmlFor="property_id" className="form-label">
                Property
              </label>

              <select
                id="property_id"
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount (₹)
              </label>

              <input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="payment_for" className="form-label">
                Payment For
              </label>

              <input
                id="payment_for"
                type="text"
                className="form-control"
                name="payment_for"
                value={formData.payment_for}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="remarks" className="form-label">
                Remarks
              </label>

              <textarea
                id="remarks"
                className="form-control"
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || properties.length === 0}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
