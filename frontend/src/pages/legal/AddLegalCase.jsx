import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createLegalCase } from "../../redux/legalSlice";
import { getProperties } from "../../services/propertyService";

export default function AddLegalCase() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    case_title: "",
    case_number: "",
    court_name: "",
    advocate_name: "",
    hearing_date: "",
    status: "Open",
    remarks: "",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const res = await getProperties();
    setProperties(res.properties);
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
      await dispatch(createLegalCase(formData)).unwrap();

      alert("Legal Case Added Successfully");

      navigate("/legal");

    } catch (err) {
      console.log(err);
      alert("Failed to Add Legal Case");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header">
          <h3>Add Legal Case</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Property */}

            <div className="mb-3">

              <label>Property</label>

              <select
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.property_name}
                  </option>
                ))}

              </select>

            </div>

            <div className="mb-3">
              <label>Case Title</label>

              <input
                className="form-control"
                name="case_title"
                value={formData.case_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Case Number</label>

              <input
                className="form-control"
                name="case_number"
                value={formData.case_number}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Court Name</label>

              <input
                className="form-control"
                name="court_name"
                value={formData.court_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Advocate Name</label>

              <input
                className="form-control"
                name="advocate_name"
                value={formData.advocate_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Hearing Date</label>

              <input
                type="date"
                className="form-control"
                name="hearing_date"
                value={formData.hearing_date}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Open</option>
                <option>Pending</option>
                <option>Closed</option>
              </select>

            </div>

            <div className="mb-3">
              <label>Remarks</label>

              <textarea
                className="form-control"
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary">
              Save Legal Case
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}