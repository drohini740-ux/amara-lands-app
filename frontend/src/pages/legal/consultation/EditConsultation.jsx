import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

export default function EditConsultation() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    consultation_date: "",
    consultation_time: "",
    meeting_type: "Online",
    reason: "",
  });

  useEffect(() => {
    loadConsultation();
  }, []);

  const loadConsultation = async () => {

    try {

      const res = await api.get(`/consultations/${id}`);

      setFormData({
        consultation_date: res.data.consultation.consultation_date || "",
        consultation_time: res.data.consultation.consultation_time || "",
        meeting_type: res.data.consultation.meeting_type || "Online",
        reason: res.data.consultation.reason || "",
      });

    } catch (err) {

      console.log(err);

      alert("Failed to load consultation");

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

    try {

      await api.put(`/consultations/${id}`, formData);

      alert("Consultation Updated Successfully");

      navigate("/consultations");

    } catch (err) {

      console.log(err);

      alert("Update Failed");

    }

  };

  return (

    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-warning">
          <h3>Edit Consultation</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label>Consultation Date</label>

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

                <label>Consultation Time</label>

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
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Phone Call">Phone Call</option>
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
              className="btn btn-success"
              type="submit"
            >
              Update Consultation
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/consultations")}
            >
              Cancel
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}