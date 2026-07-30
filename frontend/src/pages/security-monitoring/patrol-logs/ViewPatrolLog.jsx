import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatrolLog } from "../../../redux/patrolLogSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewPatrolLog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { log } = useSelector((state) => state.patrolLogs);

  useEffect(() => {
    dispatch(fetchPatrolLog(id));
  }, [dispatch, id]);

  if (!log) {
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
          <h4>View Patrol Log</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Property ID</th>
                <td>{log.property_id}</td>
              </tr>

              <tr>
                <th>Property Name</th>
                <td>{log.property_name}</td>
              </tr>

              <tr>
                <th>Patrol Date</th>
                <td>{log.patrol_date}</td>
              </tr>

              <tr>
                <th>Check In</th>
                <td>{log.check_in}</td>
              </tr>

              <tr>
                <th>Check Out</th>
                <td>{log.check_out}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{log.patrol_status}</td>
              </tr>

              <tr>
                <th>Remarks</th>
                <td>{log.remarks}</td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/patrol-logs")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}