import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicket } from "../../../redux/ticketSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewTicket() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticket } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTicket(id));
  }, [dispatch, id]);

  if (!ticket) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-info text-white">
          <h4>View Support Ticket</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Subject</th>
                <td>{ticket.subject}</td>
              </tr>

              <tr>
                <th>Description</th>
                <td>{ticket.description}</td>
              </tr>

              <tr>
                <th>Priority</th>
                <td>{ticket.priority}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{ticket.status}</td>
              </tr>

              <tr>
                <th>User</th>
                <td>{ticket.user_name || ticket.user_id}</td>
              </tr>

              <tr>
                <th>Created At</th>
                <td>{ticket.created_at}</td>
              </tr>

              <tr>
                <th>Updated At</th>
                <td>{ticket.updated_at}</td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/tickets")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}