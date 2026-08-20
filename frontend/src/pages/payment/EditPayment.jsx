import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    property_id: "",
    amount: "",
    payment_for: "",
    payment_method: "",
    payment_status: "Pending",
    payment_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [propertiesResponse, paymentResponse] =
        await Promise.all([
          api.get("/properties"),
          api.get(`/payments/${id}`),
        ]);

      setProperties(
        propertiesResponse.data.properties || []
      );

      const payment = paymentResponse.data.payment;

      setFormData({
        property_id: payment.property_id || "",
        amount: payment.amount || "",
        payment_for: payment.payment_for || "",
        payment_method: payment.payment_method || "",
        payment_status:
          payment.payment_status || "Pending",
        payment_date: payment.payment_date
          ? payment.payment_date.substring(0, 10)
          : "",
        remarks: payment.remarks || "",
      });
    } catch (error) {
      console.error("Fetch edit payment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load payment."
      );

      navigate("/payments");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/payments/${id}`, formData);

      alert("Payment Updated Successfully");

      navigate("/payments");
    } catch (error) {
      console.error("Update payment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update payment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <h4>Loading Payment...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card shadow">

        <div className="card-header">
          <h3 className="mb-0">Edit Payment</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Property
              </label>

              <select
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Property
                </option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.property_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Amount
              </label>

              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Purpose
              </label>

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
              <label className="form-label">
                Payment Method
              </label>

              <select
                className="form-select"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Method
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Razorpay">
                  Razorpay
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
                required
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Failed">
                  Failed
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Payment Date
              </label>

              <input
                type="date"
                className="form-control"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Remarks
              </label>

              <textarea
                className="form-control"
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Payment"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/payments")}
              disabled={saving}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}