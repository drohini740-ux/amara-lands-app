import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  removeTicket,
} from "../../../redux/ticketSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Tickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets, loading } = useSelector(
    (state) => state.tickets
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filteredTickets = tickets?.filter((ticket) =>
    ticket.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await dispatch(removeTicket(id)).unwrap();
      alert("Ticket Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Tickets...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Support Tickets</h2>
          <p className="text-muted">Manage Customer Support Tickets</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/support-tickets/add")}
        >
          <FaPlus className="me-2" />
          Add Ticket
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search Subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Ticket List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">

            <table className="table table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTickets?.length > 0 ? (

                  filteredTickets.map((ticket) => (

                    <tr key={ticket.id}>
                      <td>{ticket.subject}</td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.status}</td>
                      <td>
                        {ticket.created_at?.substring(0, 10)}
                      </td>

                      <td>

                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() =>
                            navigate(`/support-tickets/view/${ticket.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/support-tickets/edit/${ticket.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>
                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="5" className="text-center">
                      No Tickets Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </div>

      </div>

    </div>
  );
}