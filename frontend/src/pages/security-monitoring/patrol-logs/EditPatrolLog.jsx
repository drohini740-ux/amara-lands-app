import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editPatrolLog } from "../../../redux/patrolLogSlice";
import { getPatrolLog } from "../../../services/patrolLogService";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPatrolLog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: "",
    patrol_date: "",
    check_in: "",
    check_out: "",
    patrol_status: "Pending",
    remarks: "",
  });

  useEffect(() => {
    loadPatrolLog();
  }, []);

  const loadPatrolLog = async () => {
    try {
      const data = await getPatrolLog(id);

      const log = data.log;

      setFormData({
        property_id: log.property_id || "",
        patrol_date: log.patrol_date?.split("T")[0] || "",
        check_in: log.check_in || "",
        check_out: log.check_out || "",
        patrol_status: log.patrol_status || "Pending",
        remarks: log.remarks || "",
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
        editPatrolLog({
          id,
          logData: formData,
        })
      ).unwrap();

      alert("Patrol Log Updated Successfully");

      navigate("/patrol-logs");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Edit Patrol Log</h4>
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
              <label>Patrol Date</label>
              <input
                type="date"
                className="form-control"
                name="patrol_date"
                value={formData.patrol_date}
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
                  value={formData.check_in}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Check Out</label>
                <input
                  type="time"
                  className="form-control"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-control"
                name="patrol_status"
                value={formData.patrol_status}
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
              type="submit"
              className="btn btn-success"
            >
              Update Patrol Log
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}