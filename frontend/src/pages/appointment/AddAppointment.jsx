import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../../redux/appointmentSlice";
import api from "../../services/api";

export default function AddAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    customer_name: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    purpose: "",
    status: "Pending",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createAppointment(formData)).unwrap();

      alert("Appointment Added Successfully");

      navigate("/appointments");

    } catch (error) {
      console.log(error);
      alert("Failed to Add Appointment");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header">
          <h3>Add Appointment</h3>
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
                required
              >
                <option value="">Select Property</option>

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
              <label>Customer Name</label>

              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Phone</label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Appointment Date</label>

              <input
                type="date"
                className="form-control"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Appointment Time</label>

              <input
                type="time"
                className="form-control"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Purpose</label>

              <input
                type="text"
                className="form-control"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Remarks</label>

              <textarea
                className="form-control"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary">
              Save Appointment
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}