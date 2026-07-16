import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function ViewLegalCase() {
  const { id } = useParams();

  const [legalCase, setLegalCase] = useState(null);

  useEffect(() => {
    fetchLegalCase();
  }, []);

  const fetchLegalCase = async () => {
    try {
      const res = await api.get(`/legal/${id}`);
      setLegalCase(res.data.legalCase);
    } catch (error) {
      console.log(error);
      alert("Failed to Load Legal Case");
    }
  };

  if (!legalCase) {
    return <h4 className="p-4">Loading...</h4>;
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header">
          <h3>View Legal Case</h3>
        </div>

        <div className="card-body">

          <p><strong>Property ID:</strong> {legalCase.property_id}</p>

          <p><strong>Case Title:</strong> {legalCase.case_title}</p>

          <p><strong>Case Number:</strong> {legalCase.case_number}</p>

          <p><strong>Court:</strong> {legalCase.court_name}</p>

          <p><strong>Advocate:</strong> {legalCase.advocate_name}</p>

          <p><strong>Hearing Date:</strong> {legalCase.hearing_date}</p>

          <p><strong>Status:</strong> {legalCase.status}</p>

          <p><strong>Remarks:</strong> {legalCase.remarks}</p>

          <Link
            to="/legal"
            className="btn btn-secondary"
          >
            Back
          </Link>

        </div>
      </div>
    </div>
  );
}