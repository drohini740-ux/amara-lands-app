import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAppointment } from "../../services/appointmentService";

export default function ViewAppointment() {
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      const res = await getAppointment(id);
      setAppointment(res.appointment);
    } catch (error) {
      console.log(error);
      alert("Failed to Load Appointment");
    }
  };

  if (!appointment) {
    return <h4 className="p-4">Loading...</h4>;
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header">
          <h3>View Appointment</h3>
        </div>

        <div className="card-body">

          <p><strong>Property:</strong> {appointment.property_name}</p>

          <p><strong>Customer:</strong> {appointment.customer_name}</p>

          <p><strong>Phone:</strong> {appointment.phone}</p>

          <p><strong>Date:</strong> {appointment.appointment_date?.substring(0,10)}</p>

          <p><strong>Time:</strong> {appointment.appointment_time}</p>

          <p><strong>Purpose:</strong> {appointment.purpose}</p>

          <p><strong>Status:</strong> {appointment.status}</p>

          <p><strong>Remarks:</strong> {appointment.remarks}</p>

          <Link
            to="/appointments"
            className="btn btn-secondary"
          >
            Back
          </Link>

        </div>

      </div>
    </div>
  );
}