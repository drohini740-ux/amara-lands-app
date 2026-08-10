import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

export default function ViewConsultation() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    loadConsultation();
  }, []);

  const loadConsultation = async () => {
    try {

      const res = await api.get(`/consultations/${id}`);

      setConsultation(res.data.consultation);

    } catch (error) {

      console.log(error);

      alert("Failed to load consultation");

    }
  };

  if (!consultation) {
    return (
      <div className="container-fluid p-4">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Consultation Details</h3>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Legal Case ID</th>
                <td>{consultation.legal_case_id}</td>
              </tr>

              <tr>
                <th>Consultation Date</th>
                <td>{consultation.consultation_date}</td>
              </tr>

              <tr>
                <th>Consultation Time</th>
                <td>{consultation.consultation_time}</td>
              </tr>

              <tr>
                <th>Meeting Type</th>
                <td>{consultation.meeting_type}</td>
              </tr>

              <tr>
                <th>Reason</th>
                <td>{consultation.reason}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-warning">
                    {consultation.status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Booked On</th>
                <td>
                  {new Date(consultation.created_at).toLocaleString()}
                </td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/consultations")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}