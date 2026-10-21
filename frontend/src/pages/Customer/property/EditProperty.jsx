
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as propertyService from "../../../services/propertyService";
import { FaArrowLeft, FaSave, FaHome } from "react-icons/fa";

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

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    let active = true;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await propertyService.getProperty(id);

        if (active) {
          setFormData({
            ...initialFormData,
            ...(response.property || {}),
          });
        }
      } catch (err) {
        console.error("Failed to load property:", err);
        if (active) setError("Unable to load property details. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProperty();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await propertyService.updateProperty(id, formData);
      alert("Property updated successfully.");
      navigate("/properties");
    } catch (err) {
      console.error("Failed to update property:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to update property. Please check your details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="property-page">
        <div className="property-panel property-message">
          <div className="property-spinner" />
          <h3>Loading property details...</h3>
          <p>Please wait while we retrieve your property.</p>
        </div>
        <PropertyStyles />
      </div>
    );
  }

  if (error && !formData.property_name && !formData.survey_number) {
    return (
      <div className="property-page">
        <div className="property-panel property-message">
          <h3>Unable to load property</h3>
          <p>{error}</p>
          <button className="property-btn property-btn-dark" onClick={() => navigate("/properties")}>
            <FaArrowLeft /> Back to Properties
          </button>
        </div>
        <PropertyStyles />
      </div>
    );
  }

  return (
    <div className="property-page">
      <div className="property-heading">
        <div className="property-heading-icon"><FaHome /></div>
        <div>
          <p className="property-eyebrow">CUSTOMER PORTAL</p>
          <h1>Edit Property</h1>
          <p>Update your property information carefully.</p>
        </div>
      </div>

      <div className="property-panel">
        <div className="property-panel-header">
          <div>
            <h2>Property Information</h2>
            <p>Fields marked with * are required.</p>
          </div>
          <span className="property-tag">EDIT DETAILS</span>
        </div>

        {error && <div className="property-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="property-form-grid">
            <div className="property-field">
              <label>Property Name *</label>
              <input name="property_name" value={formData.property_name || ""} onChange={handleChange} required />
            </div>

            <div className="property-field">
              <label>Survey Number *</label>
              <input name="survey_number" value={formData.survey_number || ""} onChange={handleChange} required />
            </div>

            <div className="property-field">
              <label>Property Type</label>
              <select name="property_type" value={formData.property_type || ""} onChange={handleChange}>
                <option value="">Select property type</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div className="property-field">
              <label>Area</label>
              <input name="area" value={formData.area || ""} onChange={handleChange} placeholder="Enter area and unit" />
            </div>

            <div className="property-field property-field-full">
              <label>Address</label>
              <input name="address" value={formData.address || ""} onChange={handleChange} />
            </div>

            <div className="property-field">
              <label>City</label>
              <input name="city" value={formData.city || ""} onChange={handleChange} />
            </div>

            <div className="property-field">
              <label>State</label>
              <input name="state" value={formData.state || ""} onChange={handleChange} />
            </div>

            <div className="property-field">
              <label>Pincode</label>
              <input
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                title="Enter a 6-digit pincode"
              />
            </div>

            <div className="property-field">
              <label>Latitude</label>
              <input type="number" step="any" name="latitude" value={formData.latitude ?? ""} onChange={handleChange} />
            </div>

            <div className="property-field">
              <label>Longitude</label>
              <input type="number" step="any" name="longitude" value={formData.longitude ?? ""} onChange={handleChange} />
            </div>
          </div>

          <div className="property-form-actions">
            <button type="button" className="property-btn property-btn-light" onClick={() => navigate("/properties")} disabled={saving}>
              <FaArrowLeft /> Cancel
            </button>
            <button type="submit" className="property-btn property-btn-gold" disabled={saving}>
              <FaSave /> {saving ? "Saving Changes..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>

      <PropertyStyles />
    </div>
  );
}

function PropertyStyles() {
  return (
    <style>{`
      .property-page{padding:28px;background:#f6f6f4;min-height:100%;color:#171717}
      .property-heading{display:flex;align-items:center;gap:16px;margin-bottom:24px}
      .property-heading-icon{width:58px;height:58px;border-radius:15px;background:#111;color:#d4af37;display:grid;place-items:center;font-size:24px}
      .property-eyebrow{font-size:11px;letter-spacing:2px;font-weight:800;color:#9a7b19;margin:0 0 5px}
      .property-heading h1{font-size:28px;font-weight:800;margin:0}
      .property-heading p:last-child{margin:5px 0 0;color:#777}
      .property-panel{background:#fff;border:1px solid #e8e5dc;border-radius:16px;box-shadow:0 8px 26px #17171708;padding:25px}
      .property-panel-header{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #eeeae0;padding-bottom:18px;margin-bottom:22px}
      .property-panel-header h2{font-size:19px;font-weight:800;margin:0 0 5px}
      .property-panel-header p{font-size:13px;color:#777;margin:0}
      .property-tag{background:#fbf4d9;color:#81630c;font-size:10px;font-weight:800;letter-spacing:1px;padding:8px 11px;border-radius:20px}
      .property-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px}
      .property-field{display:flex;flex-direction:column;gap:8px}
      .property-field-full{grid-column:1/-1}
      .property-field label{font-size:13px;font-weight:700;color:#333}
      .property-field input,.property-field select{width:100%;border:1px solid #dedede;border-radius:9px;padding:12px 13px;background:#fff;color:#222;outline:none;min-height:45px}
      .property-field input:focus,.property-field select:focus{border-color:#c4a02b;box-shadow:0 0 0 3px #d4af3720}
      .property-form-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:25px;padding-top:20px;border-top:1px solid #eeeae0}
      .property-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:11px 17px;border-radius:9px;border:1px solid transparent;font-weight:700;cursor:pointer;transition:.2s}
      .property-btn:disabled{opacity:.6;cursor:not-allowed}
      .property-btn-gold{background:#d4af37;color:#111}
      .property-btn-gold:hover:not(:disabled){background:#c29b22}
      .property-btn-dark{background:#111;color:#fff}
      .property-btn-light{background:#fff;border-color:#ddd;color:#333}
      .property-btn-light:hover:not(:disabled){background:#f5f5f5}
      .property-alert{background:#fff0ef;border:1px solid #f0c7c3;color:#a52d24;padding:12px 14px;border-radius:9px;margin-bottom:18px;font-size:14px}
      .property-message{text-align:center;padding:50px 20px}
      .property-message h3{font-weight:800}
      .property-message p{color:#777;margin:10px 0 20px}
      .property-spinner{width:32px;height:32px;border:3px solid #eee;border-top-color:#d4af37;border-radius:50%;animation:property-spin .8s linear infinite;margin:0 auto 15px}
      @keyframes property-spin{to{transform:rotate(360deg)}}
      @media(max-width:650px){.property-page{padding:15px}.property-heading h1{font-size:23px}.property-panel{padding:17px}.property-form-grid{grid-template-columns:1fr}.property-field-full{grid-column:auto}.property-panel-header{align-items:flex-start}.property-form-actions{flex-direction:column-reverse}.property-btn{width:100%}}
    `}</style>
  );
}
