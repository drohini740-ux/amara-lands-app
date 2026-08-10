import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicket,
  editTicket,
} from "../../../redux/ticketSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTicket() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticket } = useSelector((state) => state.tickets);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });

  useEffect(() => {
    dispatch(fetchTicket(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        subject: ticket.subject || "",
        description: ticket.description || "",
        priority: ticket.priority || "Medium",
        status: ticket.status || "Open",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        editTicket({
          id,
          ticketData: formData,
        })
      ).unwrap();

      alert("Ticket Updated Successfully");

      navigate("/tickets");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  if (!ticket) return <h4 className="p-4">Loading...</h4>;

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-warning text-dark">
          <h4>Edit Support Ticket</h4>
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

            <button type="submit" className="btn btn-success me-2">
              Update Ticket
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/tickets")}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}