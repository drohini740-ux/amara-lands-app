import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CaseTracking() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await api.get("/case-tracking");
      setCases(res.data.cases || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Case Tracking</h2>
          <p className="text-muted">
            Track your legal cases
          </p>
        </div>
      </div>

      <div className="card shadow">

        <div className="card-body">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>Case Title</th>
                <th>Case Number</th>
                <th>Court</th>
                <th>Advocate</th>
                <th>Hearing Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>

            </thead>

            <tbody>

              {cases.length > 0 ? (
                cases.map((item) => (

                  <tr key={item.id}>

                    <td>{item.case_title}</td>

                    <td>{item.case_number}</td>

                    <td>{item.court_name}</td>

                    <td>{item.advocate_name}</td>

                    <td>
                      {item.hearing_date
                        ? new Date(item.hearing_date).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          item.status === "Closed"
                            ? "bg-success"
                            : item.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-primary"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>{item.remarks || "-"}</td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Cases Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}