import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditPayment() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    amount: "",
    payment_for: "",
    payment_method: "",
    payment_status: "",
    remarks: "",
  });

  useEffect(() => {

    fetchProperties();

    fetchPayment();

  }, []);

  const fetchProperties = async () => {
    const res = await api.get("/properties");
    setProperties(res.data.properties);
  };

  const fetchPayment = async () => {

    const res = await api.get(`/payments/${id}`);

    setFormData(res.data.payment);

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await api.put(
      `/payments/${id}`,
      formData
    );

    alert("Payment Updated Successfully");

    navigate("/payments");

  };

  return (
    <div className="container-fluid">

      <div className="card shadow">

        <div className="card-header">

          <h3>Edit Payment</h3>

        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label>Property</label>

              <select
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
              >

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

              <label>Amount</label>

              <input
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />

            </div>

            <div className="mb-3">

              <label>Purpose</label>

              <input
                className="form-control"
                name="payment_for"
                value={formData.payment_for}
                onChange={handleChange}
              />

            </div>

            <div className="mb-3">

              <label>Method</label>

              <input
                className="form-control"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              />

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
                value={formData.remarks || ""}
                onChange={handleChange}
              />

            </div>

            <button className="btn btn-primary">

              Update Payment

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}