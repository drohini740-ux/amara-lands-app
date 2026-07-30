import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editFieldVisit } from "../../../redux/fieldVisitSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getFieldVisit } from "../../../services/fieldVisitService";

export default function EditFieldVisit() {
  const { id } = useParams();

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

  useEffect(() => {
    loadVisit();
  }, []);

  const loadVisit = async () => {
    try {
      const data = await getFieldVisit(id);

      const visit = data.visit;

      setFormData({
        property_id: visit.property_id || "",
        visit_date: visit.visit_date?.split("T")[0] || "",
        check_in: visit.check_in || "",
        check_out: visit.check_out || "",
        visit_status: visit.visit_status || "Pending",
        remarks: visit.remarks || "",
      });
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

    try {
      await dispatch(
        editFieldVisit({
          id,
          visitData: formData,
        })
      ).unwrap();

      alert("Field Visit Updated Successfully");

      navigate("/field-visits");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Edit Field Visit</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Property ID</label>
              <input
                type="number"
                className="form-control"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Visit Date</label>
              <input
                type="date"
                className="form-control"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleChange}
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Check In</label>
                <input
                  type="time"
                  className="form-control"
                  name="check_in"
                  value={formData.check_in || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Check Out</label>
                <input
                  type="time"
                  className="form-control"
                  name="check_out"
                  value={formData.check_out || ""}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-control"
                name="visit_status"
                value={formData.visit_status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Remarks</label>
              <textarea
                rows="4"
                className="form-control"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-success"
              type="submit"
            >
              Update Field Visit
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}