
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProperty } from "../../../redux/propertySlice";
import {
  FaHome,
  FaMapMarkerAlt,
  FaSave,
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa";

const initialFormData = {
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
};

export default function AddProperty() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialFormData);
  const [showMap, setShowMap] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by this browser.");
      return;
    }

    setGettingLocation(true);
    setLocationMessage("Requesting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((prev) => ({ ...prev, latitude, longitude }));
        setShowMap(true);
        setGettingLocation(false);
        setLocationMessage("Location captured successfully.");
      },
      (err) => {
        console.error("Unable to fetch location:", err);
        setGettingLocation(false);

        const message =
          err.code === 1
            ? "Location permission was denied. Please allow location access in your browser."
            : err.code === 2
              ? "Your location is currently unavailable. Please try again."
              : err.code === 3
                ? "Location request timed out. Please try again."
                : "Unable to fetch your location.";

        setLocationMessage(message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.latitude || !formData.longitude) {
      setError("Please capture your current location before saving the property.");
      return;
    }

    setSaving(true);

    try {
      await dispatch(createProperty(formData)).unwrap();
      alert("Property added successfully.");
      navigate("/properties");
    } catch (err) {
      console.error("Failed to add property:", err);
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to add property. Please check your details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-property-page">
      <div className="add-property-heading">
        <div className="add-property-heading-icon"><FaHome /></div>
        <div>
          <p className="add-property-eyebrow">CUSTOMER PORTAL</p>
          <h1>Add Property</h1>
          <p>Register your land or property with Amara Lands.</p>
        </div>
      </div>

      <div className="add-property-panel">
        <div className="add-property-panel-header">
          <div>
            <h2>Property Information</h2>
            <p>Enter accurate details for property verification.</p>
          </div>
          <span className="add-property-tag">NEW PROPERTY</span>
        </div>

        {error && <div className="add-property-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="add-property-grid">
            <div className="add-property-field">
              <label>Property Name *</label>
              <input name="property_name" value={formData.property_name} onChange={handleChange} required placeholder="e.g. Green Valley Plot" />
            </div>

            <div className="add-property-field">
              <label>Survey Number *</label>
              <input name="survey_number" value={formData.survey_number} onChange={handleChange} required placeholder="Enter survey number" />
            </div>

            <div className="add-property-field">
              <label>Property Type *</label>
              <select name="property_type" value={formData.property_type} onChange={handleChange} required>
                <option value="">Select property type</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div className="add-property-field">
              <label>Area *</label>
              <input name="area" value={formData.area} onChange={handleChange} required placeholder="e.g. 1200 sq. ft." />
            </div>

            <div className="add-property-field add-property-full">
              <label>Address *</label>
              <input name="address" value={formData.address} onChange={handleChange} required placeholder="Property street address" />
            </div>

            <div className="add-property-field">
              <label>City *</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="add-property-field">
              <label>State *</label>
              <input name="state" value={formData.state} onChange={handleChange} required />
            </div>

            <div className="add-property-field">
              <label>Pincode *</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} title="Enter a 6-digit pincode" required placeholder="6-digit pincode" />
            </div>
          </div>

          <div className="add-property-location">
            <div className="add-property-location-title">
              <div className="add-property-location-icon"><FaMapMarkerAlt /></div>
              <div>
                <h3>Geo-tag Location</h3>
                <p>Capture the current coordinates for this property.</p>
              </div>
            </div>

            <button type="button" className="add-property-btn add-property-btn-dark" onClick={getCurrentLocation} disabled={gettingLocation}>
              <FaMapMarkerAlt />
              {gettingLocation ? "Getting Location..." : "Get Current Location"}
            </button>

            {locationMessage && (
              <p className={`add-property-location-message ${formData.latitude && formData.longitude ? "location-success" : ""}`}>
                {locationMessage}
              </p>
            )}

            <div className="add-property-grid add-property-coordinate-grid">
              <div className="add-property-field">
                <label>Latitude</label>
                <input type="number" step="any" value={formData.latitude} placeholder="Captured automatically" readOnly />
              </div>
              <div className="add-property-field">
                <label>Longitude</label>
                <input type="number" step="any" value={formData.longitude} placeholder="Captured automatically" readOnly />
              </div>
            </div>

            {showMap && formData.latitude && formData.longitude && (
              <div className="add-property-map">
                <h4>Location Preview</h4>
                <iframe
                  title="Property Location"
                  width="100%"
                  height="320"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                />
                <a
                  href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="add-property-map-link"
                >
                  <FaExternalLinkAlt /> Open in Google Maps
                </a>
              </div>
            )}
          </div>

          <div className="add-property-actions">
            <button type="button" className="add-property-btn add-property-btn-light" onClick={() => navigate("/properties")} disabled={saving}>
              <FaArrowLeft /> Cancel
            </button>
            <button type="submit" className="add-property-btn add-property-btn-gold" disabled={saving}>
              <FaSave /> {saving ? "Saving Property..." : "Save Property"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-property-page{padding:28px;background:#f6f6f4;min-height:100%;color:#171717}
        .add-property-heading{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .add-property-heading-icon{width:58px;height:58px;border-radius:15px;background:#111;color:#d4af37;display:grid;place-items:center;font-size:24px}
        .add-property-eyebrow{font-size:11px;letter-spacing:2px;font-weight:800;color:#9a7b19;margin:0 0 5px}
        .add-property-heading h1{font-size:28px;font-weight:800;margin:0}
        .add-property-heading p:last-child{margin:5px 0 0;color:#777}
        .add-property-panel{background:#fff;border:1px solid #e8e5dc;border-radius:16px;box-shadow:0 8px 26px #17171708;padding:25px}
        .add-property-panel-header{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #eeeae0;padding-bottom:18px;margin-bottom:22px}
        .add-property-panel-header h2{font-size:19px;font-weight:800;margin:0 0 5px}
        .add-property-panel-header p{font-size:13px;color:#777;margin:0}
        .add-property-tag{background:#fbf4d9;color:#81630c;font-size:10px;font-weight:800;letter-spacing:1px;padding:8px 11px;border-radius:20px}
        .add-property-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px}
        .add-property-full{grid-column:1/-1}
        .add-property-field{display:flex;flex-direction:column;gap:8px}
        .add-property-field label{font-size:13px;font-weight:700;color:#333}
        .add-property-field input,.add-property-field select{width:100%;border:1px solid #dedede;border-radius:9px;padding:12px 13px;background:#fff;color:#222;outline:none;min-height:45px}
        .add-property-field input:focus,.add-property-field select:focus{border-color:#c4a02b;box-shadow:0 0 0 3px #d4af3720}
        .add-property-location{margin-top:28px;padding:22px;border:1px solid #eee8d8;background:#fdfcf8;border-radius:13px}
        .add-property-location-title{display:flex;align-items:center;gap:12px;margin-bottom:17px}
        .add-property-location-icon{width:43px;height:43px;border-radius:11px;background:#fbf1cb;color:#997710;display:grid;place-items:center;font-size:18px}
        .add-property-location-title h3{font-size:17px;font-weight:800;margin:0 0 4px}
        .add-property-location-title p{font-size:13px;color:#777;margin:0}
        .add-property-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:11px 17px;border-radius:9px;border:1px solid transparent;font-weight:700;cursor:pointer;transition:.2s}
        .add-property-btn:disabled{opacity:.6;cursor:not-allowed}
        .add-property-btn-gold{background:#d4af37;color:#111}
        .add-property-btn-gold:hover:not(:disabled){background:#c29b22}
        .add-property-btn-dark{background:#111;color:#fff}
        .add-property-btn-dark:hover:not(:disabled){background:#292929}
        .add-property-btn-light{background:#fff;border-color:#ddd;color:#333}
        .add-property-location-message{font-size:13px;color:#a52d24;margin:12px 0}
        .add-property-location-message.location-success{color:#287343}
        .add-property-coordinate-grid{margin-top:18px}
        .add-property-field input:read-only{background:#f2f2f2;color:#555}
        .add-property-map{margin-top:22px}
        .add-property-map h4{font-size:15px;font-weight:800;margin-bottom:12px}
        .add-property-map iframe{border:1px solid #ddd;border-radius:10px;display:block}
        .add-property-map-link{display:inline-flex;gap:8px;align-items:center;margin-top:12px;color:#80620b;font-weight:700;text-decoration:none}
        .add-property-map-link:hover{text-decoration:underline}
        .add-property-alert{background:#fff0ef;border:1px solid #f0c7c3;color:#a52d24;padding:12px 14px;border-radius:9px;margin-bottom:18px;font-size:14px}
        .add-property-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:25px;padding-top:20px;border-top:1px solid #eeeae0}
        @media(max-width:650px){.add-property-page{padding:15px}.add-property-heading h1{font-size:23px}.add-property-panel{padding:17px}.add-property-grid{grid-template-columns:1fr}.add-property-full{grid-column:auto}.add-property-panel-header{align-items:flex-start}.add-property-location{padding:15px}.add-property-actions{flex-direction:column-reverse}.add-property-btn{width:100%}}
      `}</style>
    </div>
  );
}
