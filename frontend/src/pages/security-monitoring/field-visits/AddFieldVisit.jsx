import { useState } from "react";
import { useDispatch } from "react-redux";
import { createFieldVisit } from "../../../redux/fieldVisitSlice";
import { useNavigate } from "react-router-dom";

export default function AddFieldVisit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: "",
    visit_date: "",
    check_in: "",
    check_out: "",
    visit_status: "Pending",
    remarks: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createFieldVisit(formData)).unwrap();

      alert("Field Visit Added Successfully");

      navigate("/field-visits");
    } catch (err) {
      console.log(err);
      alert("Failed to Add Field Visit");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Add Field Visit</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Property ID</label>

              <input
                type="number"
                className="form-control"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Visit Date</label>

              <input
                type="date"
                className="form-control"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">Check In</label>

                <input
                  type="time"
                  className="form-control"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Check Out</label>

                <input
                  type="time"
                  className="form-control"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>

              <select
                className="form-select"
                name="visit_status"
                value={formData.visit_status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Remarks</label>

              <textarea
                className="form-control"
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success me-2"
            >
              Save Field Visit
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/field-visits")}
            >
              Cancel
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}