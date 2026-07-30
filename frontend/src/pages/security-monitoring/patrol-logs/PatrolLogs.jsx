import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatrolLogs,
  removePatrolLog,
} from "../../../redux/patrolLogSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function PatrolLogs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { logs, loading } = useSelector(
    (state) => state.patrolLogs
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPatrolLogs());
  }, [dispatch]);

  const filteredLogs = logs?.filter((log) =>
    log.property_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patrol log?")) return;

    try {
      await dispatch(removePatrolLog(id)).unwrap();
      alert("Patrol Log Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Patrol Logs...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Patrol Logs</h2>
          <p className="text-muted">Manage Property Patrol Logs</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/patrol-logs/add")}
        >
          <FaPlus className="me-2" />
          Add Patrol Log
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              className="form-control"
              placeholder="Search Property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>
      </div>

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">Patrol Log List</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Property</th>
                  <th>Patrol Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredLogs?.length > 0 ? (

                  filteredLogs.map((log) => (

                    <tr key={log.id}>

                      <td>{log.property_name}</td>

                      <td>{log.patrol_date}</td>

                      <td>{log.check_in}</td>

                      <td>{log.check_out}</td>

                      <td>
                        <span className="badge bg-success">
                          {log.patrol_status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() =>
                            navigate(`/patrol-logs/view/${log.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/patrol-logs/edit/${log.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(log.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="6" className="text-center">
                      No Patrol Logs Found
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