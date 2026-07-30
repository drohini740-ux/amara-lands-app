import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFieldVisit } from "../../../redux/fieldVisitSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewFieldVisit() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { visit, loading } = useSelector(
    (state) => state.fieldVisits
  );

  useEffect(() => {
    dispatch(fetchFieldVisit(id));
  }, [dispatch, id]);

  if (loading || !visit) {
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
          <h4>View Field Visit</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Property</th>
                <td>{visit.property_name}</td>
              </tr>

              <tr>
                <th>User</th>
                <td>{visit.user_name}</td>
              </tr>

              <tr>
                <th>Visit Date</th>
                <td>{visit.visit_date?.split("T")[0]}</td>
              </tr>

              <tr>
                <th>Check In</th>
                <td>{visit.check_in}</td>
              </tr>

              <tr>
                <th>Check Out</th>
                <td>{visit.check_out}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{visit.visit_status}</td>
              </tr>

              <tr>
                <th>Remarks</th>
                <td>{visit.remarks}</td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/field-visits")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}