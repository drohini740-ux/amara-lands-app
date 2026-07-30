import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSurveillanceCamera } from "../../../redux/surveillanceCameraSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewSurveillanceCamera() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { camera } = useSelector((state) => state.surveillanceCameras);

  useEffect(() => {
    dispatch(fetchSurveillanceCamera(id));
  }, [dispatch, id]);

  if (!camera) {
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
          <h4>View Surveillance Camera</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Camera Name</th>
                <td>{camera.camera_name}</td>
              </tr>

              <tr>
                <th>Property ID</th>
                <td>{camera.property_id}</td>
              </tr>

              <tr>
                <th>Camera Location</th>
                <td>{camera.camera_location}</td>
              </tr>

              <tr>
                <th>Camera Type</th>
                <td>{camera.camera_type}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{camera.status}</td>
              </tr>

              <tr>
                <th>Installation Date</th>
                <td>{camera.installation_date}</td>
              </tr>

              <tr>
                <th>Remarks</th>
                <td>{camera.remarks}</td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/surveillance-cameras")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}