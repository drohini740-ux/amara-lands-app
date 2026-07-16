import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  updateAppointment,
} from "../../services/appointmentService";
import api from "../../services/api";

export default function EditAppointment() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    customer_name: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    purpose: "",
    status: "",
    remarks: "",
  });

  useEffect(() => {
    loadAppointment();
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const res = await api.get("/properties");
      setProperties(res.data.properties);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAppointment = async () => {
    try {
      const res = await getAppointment(id);

      setFormData({
        property_id: res.appointment.property_id,
        customer_name: res.appointment.customer_name,
        phone: res.appointment.phone,
        appointment_date:
          res.appointment.appointment_date?.substring(0, 10),
        appointment_time: res.appointment.appointment_time?.substring(0, 5),
        purpose: res.appointment.purpose,
        status: res.appointment.status,
        remarks: res.appointment.remarks,
      });

    } catch (error) {
      console.log(error);
      alert("Failed to Load Appointment");
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

      await updateAppointment(id, formData);

      alert("Appointment Updated Successfully");

      navigate("/appointments");

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header">
          <h3>Edit Appointment</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <select
              className="form-select mb-3"
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

            <input
              className="form-control mb-3"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="date"
              className="form-control mb-3"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
            />

            <input
              type="time"
              className="form-control mb-3"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />

            <select
              className="form-select mb-3"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <textarea
              className="form-control mb-3"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />

            <button className="btn btn-primary">
              Update Appointment
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}