import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "../../../redux/ticketSlice";
import { useNavigate } from "react-router-dom";

export default function AddTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createTicket(formData)).unwrap();

      alert("Ticket Created Successfully");

      navigate("/support-tickets");
    } catch (err) {
      console.log(err);
      alert("Failed to Create Ticket");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4>Add Support Ticket</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Subject</label>

              <input
                type="text"
                className="form-control"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                className="form-control"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Priority</label>

              <select
                className="form-control"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              Save Ticket
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}