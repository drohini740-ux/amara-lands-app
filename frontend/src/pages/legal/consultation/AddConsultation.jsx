import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function AddConsultation() {
  const navigate = useNavigate();

  const [legalCases, setLegalCases] = useState([]);

  const [formData, setFormData] = useState({
    legal_case_id: "",
    consultation_date: "",
    consultation_time: "",
    meeting_type: "Online",
    reason: "",
  });

  useEffect(() => {
    loadLegalCases();
  }, []);

  const loadLegalCases = async () => {
    try {
      const res = await api.get("/legal");

      setLegalCases(res.data.legalCases || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.legal_case_id ||
      !formData.consultation_date ||
      !formData.consultation_time
    ) {
      alert("Please fill all mandatory fields.");
      return;
    }

    try {
      await api.post("/consultations", formData);

      alert("Consultation Booked Successfully");

      navigate("/legal");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || "Booking Failed"
      );
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Book Consultation</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Legal Case
              </label>

              <select
                className="form-select"
                name="legal_case_id"
                value={formData.legal_case_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Case
                </option>

                {legalCases.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.case_title}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Date</label>

                <input
                  type="date"
                  className="form-control"
                  name="consultation_date"
                  value={formData.consultation_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Time</label>

                <input
                  type="time"
                  className="form-control"
                  name="consultation_time"
                  value={formData.consultation_time}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="mb-3">
              <label>Meeting Type</label>

              <select
                className="form-select"
                name="meeting_type"
                value={formData.meeting_type}
                onChange={handleChange}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Phone Call</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Reason</label>

              <textarea
                className="form-control"
                rows="4"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              Book Consultation
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/legal")}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}