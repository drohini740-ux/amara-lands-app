import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProperty } from "../../redux/propertySlice";

export default function AddProperty() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    property_name: "",
    survey_number: "",
    property_type: "",
    area: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    try {
      await dispatch(createProperty(formData)).unwrap();

      alert("Property Added Successfully");
      navigate("/properties");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to add property");
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Add Property</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Property Name</label>

                <input
                  className="form-control"
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Survey Number</label>

                <input
                  className="form-control"
                  name="survey_number"
                  value={formData.survey_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Property Type</label>

                <select
                  className="form-control"
                  name="property_type"
                  onChange={handleChange}
                >
                  <option>Select Type</option>

                  <option>Agricultural</option>

                  <option>Residential</option>

                  <option>Commercial</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Area</label>

                <input
                  className="form-control"
                  name="area"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Address</label>

                <input
                  className="form-control"
                  name="address"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>City</label>

                <input
                  className="form-control"
                  name="city"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>State</label>

                <input
                  className="form-control"
                  name="state"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Pincode</label>

                <input
                  className="form-control"
                  name="pincode"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Latitude</label>

                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="17.3850"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Longitude</label>

                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="78.4867"
                />
              </div>
            </div>

            <button className="btn btn-success">Save Property</button>

            <button
              type="button"
              className="btn btn-secondary ms-3"
              onClick={() => navigate("/properties")}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
