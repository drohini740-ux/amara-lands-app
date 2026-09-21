import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import API from "../../../services/api";

const initialForm = {
  staff_id: "",
  property_id: "",
  assignment_type: "",
  assignment_date: "",
  status: "Pending",
  notes: "",
};

export default function AddStaffAssignment() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [staff, setStaff] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [staffResponse, propertyResponse] = await Promise.all([
          API.get("/admin/staff-assignments/staff"),
          API.get("/admin/staff-assignments/properties"),
        ]);

        setStaff(staffResponse.data?.data || []);
        setProperties(propertyResponse.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load assignment data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.staff_id ||
      !form.property_id ||
      !form.assignment_type.trim() ||
      !form.assignment_date
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await API.post("/admin/staff-assignments", form);

      toast.success(
        response.data?.message || "Staff assignment created successfully"
      );

      navigate("/admin/staff");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create assignment"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Create Staff Assignment</h2>
          <p className="text-muted mb-0">
            Assign a staff member to a property.
          </p>
        </div>

        <Link to="/admin/staff" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-2" />
          Back
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Staff Member <span className="text-danger">*</span>
                  </label>
                  <select
                    name="staff_id"
                    className="form-select"
                    value={form.staff_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Staff</option>
                    {staff.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name} - {item.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Property <span className="text-danger">*</span>
                  </label>
                  <select
                    name="property_id"
                    className="form-select"
                    value={form.property_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.property_name} - {item.survey_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Assignment Type <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="assignment_type"
                    className="form-control"
                    placeholder="e.g. Property Inspection"
                    value={form.assignment_type}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Assignment Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="assignment_date"
                    className="form-control"
                    value={form.assignment_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="4"
                    placeholder="Optional notes"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={saving}
                  >
                    <FaSave className="me-2" />
                    {saving ? "Saving..." : "Create Assignment"}
                  </button>

                  <Link to="/admin/staff" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
