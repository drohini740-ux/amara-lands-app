import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as propertyService from "../../services/propertyService";

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const response = await propertyService.getProperty(id);

      setFormData(response.property);

      setLoading(false);

    } catch (error) {
      console.log(error);
      alert("Failed to load property");
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

      await propertyService.updateProperty(id, formData);

      alert("Property Updated Successfully");

      navigate("/properties");

    } catch (error) {

      console.log(error);

      alert("Failed to update property");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h3>Loading Property...</h3>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <h2 className="fw-bold mb-4">
        Edit Property
      </h2>

      {/* Form will be added in the next step */}
<div className="card shadow-sm">
  <div className="card-body">

    <form onSubmit={handleSubmit}>

      <div className="row">

        <div className="col-md-6 mb-3">
          <label>Property Name</label>
          <input
            className="form-control"
            name="property_name"
            value={formData.property_name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Survey Number</label>
          <input
            className="form-control"
            name="survey_number"
            value={formData.survey_number || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Property Type</label>

          <select
            className="form-select"
            name="property_type"
            value={formData.property_type || ""}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label>Area</label>
          <input
            className="form-control"
            name="area"
            value={formData.area || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-12 mb-3">
          <label>Address</label>
          <input
            className="form-control"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>City</label>
          <input
            className="form-control"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>State</label>
          <input
            className="form-control"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Pincode</label>
          <input
            className="form-control"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Latitude</label>
          <input
            className="form-control"
            name="latitude"
            value={formData.latitude || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Longitude</label>
          <input
            className="form-control"
            name="longitude"
            value={formData.longitude || ""}
            onChange={handleChange}
          />
        </div>

      </div>

      <button
        className="btn btn-primary"
        type="submit"
      >
        Update Property
      </button>

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