
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as propertyService from "../../../services/propertyService";
import {
  FaArrowLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaHome,
} from "react-icons/fa";

export default function ViewProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await propertyService.getProperty(id);

        if (active) setProperty(response.property);
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

  const status = property?.verification_status || "Pending";
  const statusClass =
    status.toLowerCase() === "verified"
      ? "view-property-status-verified"
      : status.toLowerCase() === "rejected"
        ? "view-property-status-rejected"
        : "view-property-status-pending";

  if (loading) {
    return (
      <div className="view-property-page">
        <div className="view-property-message">
          <div className="view-property-spinner" />
          <h3>Loading property details...</h3>
        </div>
        <ViewPropertyStyles />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="view-property-page">
        <div className="view-property-message">
          <h3>Property Details Unavailable</h3>
          <p>{error || "The requested property could not be found."}</p>
          <button className="view-property-btn view-property-btn-dark" onClick={() => navigate("/properties")}>
            <FaArrowLeft /> Back to Properties
          </button>
        </div>
        <ViewPropertyStyles />
      </div>
    );
  }

  const details = [
    ["Property Name", property.property_name],
    ["Survey Number", property.survey_number],
    ["Property Type", property.property_type],
    ["Area", property.area],
    ["Address", property.address],
    ["City", property.city],
    ["State", property.state],
    ["Pincode", property.pincode],
    ["Latitude", property.latitude],
    ["Longitude", property.longitude],
    [
      "Created Date",
      property.created_at
        ? new Date(property.created_at).toLocaleDateString()
        : "—",
    ],
  ];

  return (
    <div className="view-property-page">
      <div className="view-property-heading">
        <div className="view-property-heading-icon"><FaHome /></div>
        <div>
          <p className="view-property-eyebrow">CUSTOMER PORTAL</p>
          <h1>Property Details</h1>
          <p>Review your registered property information.</p>
        </div>
      </div>

      <div className="view-property-panel">
        <div className="view-property-top">
          <div>
            <span className="view-property-label">PROPERTY</span>
            <h2>{property.property_name || "Unnamed Property"}</h2>
            <p>Survey No: {property.survey_number || "—"}</p>
          </div>
          <span className={`view-property-status ${statusClass}`}>{status}</span>
        </div>

        <div className="view-property-section-title">Property Information</div>
        <div className="view-property-details">
          {details.map(([label, value]) => (
            <div className="view-property-detail" key={label}>
              <span>{label}</span>
              <strong>{value === null || value === undefined || value === "" ? "—" : String(value)}</strong>
            </div>
          ))}
        </div>

        {property.latitude && property.longitude && (
          <div className="view-property-map-section">
            <div className="view-property-section-title">
              <FaMapMarkerAlt /> Geo-tag Location
            </div>

            <iframe
              title="Property Location"
              width="100%"
              height="350"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`}
            />

            <a
              href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="view-property-map-link"
            >
              <FaExternalLinkAlt /> Open in Google Maps
            </a>
          </div>
        )}

        <div className="view-property-actions">
          <button className="view-property-btn view-property-btn-light" onClick={() => navigate("/properties")}>
            <FaArrowLeft /> Back to Properties
          </button>
          <button className="view-property-btn view-property-btn-gold" onClick={() => navigate(`/properties/edit/${id}`)}>
            <FaEdit /> Edit Property
          </button>
        </div>
      </div>

      <ViewPropertyStyles />
    </div>
  );
}

function ViewPropertyStyles() {
  return (
    <style>{`
      .view-property-page{padding:28px;background:#f6f6f4;min-height:100%;color:#171717}
      .view-property-heading{display:flex;align-items:center;gap:16px;margin-bottom:24px}
      .view-property-heading-icon{width:58px;height:58px;border-radius:15px;background:#111;color:#d4af37;display:grid;place-items:center;font-size:24px}
      .view-property-eyebrow{font-size:11px;letter-spacing:2px;font-weight:800;color:#9a7b19;margin:0 0 5px}
      .view-property-heading h1{font-size:28px;font-weight:800;margin:0}
      .view-property-heading p:last-child{margin:5px 0 0;color:#777}
      .view-property-panel{background:#fff;border:1px solid #e8e5dc;border-radius:16px;box-shadow:0 8px 26px #17171708;padding:25px}
      .view-property-top{display:flex;justify-content:space-between;align-items:flex-start;gap:15px;padding-bottom:22px;border-bottom:1px solid #eeeae0}
      .view-property-label{font-size:10px;letter-spacing:1.8px;font-weight:800;color:#9a7b19}
      .view-property-top h2{font-size:24px;font-weight:800;margin:7px 0}
      .view-property-top p{font-size:13px;color:#777;margin:0}
      .view-property-status{display:inline-block;padding:8px 13px;border-radius:30px;font-size:12px;font-weight:800;white-space:nowrap}
      .view-property-status-verified{background:#e4f5e9;color:#217542}
      .view-property-status-rejected{background:#ffebea;color:#a52d24}
      .view-property-status-pending{background:#fbf1cb;color:#80620b}
      .view-property-section-title{display:flex;align-items:center;gap:9px;font-size:16px;font-weight:800;margin:23px 0 15px}
      .view-property-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;border:1px solid #eeeae0;border-radius:12px;overflow:hidden}
      .view-property-detail{display:flex;flex-direction:column;gap:7px;padding:15px;border-bottom:1px solid #eeeae0;min-width:0}
      .view-property-detail:nth-child(odd){background:#fdfcf9}
      .view-property-detail span{font-size:12px;color:#777}
      .view-property-detail strong{font-size:14px;font-weight:700;overflow-wrap:anywhere}
      .view-property-map-section{margin-top:25px}
      .view-property-map-section iframe{display:block;border:1px solid #ddd;border-radius:11px}
      .view-property-map-link{display:inline-flex;gap:8px;align-items:center;margin-top:12px;color:#80620b;font-weight:700;text-decoration:none}
      .view-property-map-link:hover{text-decoration:underline}
      .view-property-actions{display:flex;justify-content:space-between;gap:12px;margin-top:25px;padding-top:20px;border-top:1px solid #eeeae0}
      .view-property-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:11px 17px;border-radius:9px;border:1px solid transparent;font-weight:700;cursor:pointer;transition:.2s}
      .view-property-btn-gold{background:#d4af37;color:#111}
      .view-property-btn-gold:hover{background:#c29b22}
      .view-property-btn-light{background:#fff;border-color:#ddd;color:#333}
      .view-property-btn-dark{background:#111;color:#fff}
      .view-property-message{text-align:center;padding:50px 20px;background:#fff;border:1px solid #eeeae0;border-radius:16px}
      .view-property-message h3{font-weight:800}
      .view-property-message p{color:#777;margin:10px 0 20px}
      .view-property-spinner{width:32px;height:32px;border:3px solid #eee;border-top-color:#d4af37;border-radius:50%;animation:view-property-spin .8s linear infinite;margin:0 auto 15px}
      @keyframes view-property-spin{to{transform:rotate(360deg)}}
      @media(max-width:650px){.view-property-page{padding:15px}.view-property-heading h1{font-size:23px}.view-property-panel{padding:17px}.view-property-details{grid-template-columns:1fr}.view-property-top{flex-direction:column}.view-property-actions{flex-direction:column-reverse}.view-property-btn{width:100%}}
    `}</style>
  );
}
