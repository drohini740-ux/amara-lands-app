import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAppointments,
  removeAppointment,
} from "../../redux/appointmentSlice";
export default function Appointments() {
  const dispatch = useDispatch();

  const { appointments, loading } = useSelector((state) => state.appointments);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeAppointment(id)).unwrap();

      alert("Appointment Deleted Successfully");

      dispatch(fetchAppointments());
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Appointments</h2>

        <Link to="/appointments/add" className="btn btn-primary">
          Add Appointment
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Customer</th>
                <th>Property</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.customer_name}</td>

                    <td>{item.property_name}</td>

                    <td>{item.phone}</td>

                    <td>{item.appointment_date?.substring(0, 10)}</td>

                    <td>{item.appointment_time}</td>

                    <td>{item.status}</td>

                    <td>
                      <Link
                        to={`/appointments/view/${item.id}`}
                        className="btn btn-info btn-sm me-2"
                      >
                        View
                      </Link>

                      <Link
                        to={`/appointments/edit/${item.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
