import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/api";
import { createOrder, verifyPayment } from "../../redux/paymentSlice";
import * as paymentService from "../../services/paymentService";

export default function AddPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    amount: "",
    payment_for: "",
    payment_method: "Razorpay",
    payment_status: "Pending",
    remarks: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");
      setProperties(res.data.properties);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    try {
      console.log("Pay Button Clicked");

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const response = await dispatch(
        createOrder({
          amount: Number(formData.amount),
        }),
      ).unwrap();

      const order = response.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Amara Lands",

        description: formData.payment_for,

        image: "/favicon.svg",

        order_id: order.id,

        prefill: {
          name: "Rohini",
          email: "rohini@example.com",
          contact: "9876543210",
        },

        notes: {
          property: formData.property_id,
        },

        theme: {
          color: "#D4AF37",
        },

        modal: {
          escape: false,

          ondismiss: function () {
            console.log("Popup Closed");
          },
        },

    handler: async function (response) {
  try {

    // Save payment in DB (Pending)
    const paymentRes = await paymentService.addPayment({
      property_id: formData.property_id,
      amount: formData.amount,
      payment_for: formData.payment_for,
      payment_method: "Razorpay",
      payment_status: "Pending",
      payment_date: new Date(),
      remarks: formData.remarks,
    });

    // Get inserted payment ID
    const paymentId = paymentRes.data.payment.id;

    // Verify payment
    await dispatch(
      verifyPayment({
        payment_id: paymentId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      })
    ).unwrap();

    alert("Payment Successful");

    navigate("/payments");

  } catch (error) {
    console.log(error);
    alert("Verification Failed");
  }
},
      };
      console.log("Razorpay Object:", window.Razorpay);
      console.log("Options:", options);
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log("Payment Failed:", response.error);
      });

      console.log("Opening Razorpay...");

      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Unable to create payment order");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h3>Add Payment</h3>
        </div>

        <div className="card-body">
          <form>
            <div className="mb-3">
              <label>Property</label>

              <select
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
              <label>Amount</label>

              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Payment For</label>

              <input
                type="text"
                className="form-control"
                name="payment_for"
                value={formData.payment_for}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Payment Method</label>

              <select
                className="form-select"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option>Razorpay</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Cash</option>
                <option>Net Banking</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-select"
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Success</option>
                <option>Failed</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Remarks</label>

              <textarea
                className="form-control"
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
