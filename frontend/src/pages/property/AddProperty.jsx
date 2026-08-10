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
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert("Please click 'Get Current Location' first.");
      return;
    }

    try {
      await dispatch(createProperty(formData)).unwrap();

      alert("Property Added Successfully");
      navigate("/properties");
    } catch (error) {
      console.error(error);
      alert("Failed to add property");
    }
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        setShowMap(true);
      },
      (error) => {
        console.log(error);
        alert("Unable to fetch your location.");
      },
    );
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
                  value={formData.property_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>

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
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Address</label>

                <input
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>City</label>

                <input
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>State</label>

                <input
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Pincode</label>

                <input
                  className="form-control"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>
              {/* Latitude */}
              <div className="col-md-6 mb-3">
                <label>Latitude</label>

                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  placeholder="Auto Generated"
                  readOnly
                />
              </div>

              {/* Longitude */}
              <div className="col-md-6 mb-3">
                <label>Longitude</label>

                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  placeholder="Auto Generated"
                  readOnly
                />
              </div>

              <div className="col-md-12 mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={getCurrentLocation}
                >
                  📍 Get Current Location
                </button>
              </div>
              {showMap && formData.latitude && formData.longitude && (
                <div className="col-md-12 mt-4">
                  <h5 className="mb-3">Location Preview</h5>

                  <iframe
                    title="Property Location"
                    width="100%"
                    height="300"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                    }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                  ></iframe>

                  <div className="mt-3">
                    <a
                      href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary"
                    >
                      📍 Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
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
