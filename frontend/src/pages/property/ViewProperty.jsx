import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as propertyService from "../../services/propertyService";

export default function ViewProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const response = await propertyService.getProperty(id);
      setProperty(response.property);
    } catch (error) {
      console.log(error);
      alert("Failed to load property");
    }
  };

  if (!property) {
    return (
      <div className="container-fluid p-4">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>Property Details</h3>
        </div>

        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Property Name</th>
                <td>{property.property_name}</td>
              </tr>

              <tr>
                <th>Survey Number</th>
                <td>{property.survey_number}</td>
              </tr>

              <tr>
                <th>Property Type</th>
                <td>{property.property_type}</td>
              </tr>

              <tr>
                <th>Area</th>
                <td>{property.area}</td>
              </tr>

              <tr>
                <th>Address</th>
                <td>{property.address}</td>
              </tr>

              <tr>
                <th>City</th>
                <td>{property.city}</td>
              </tr>

              <tr>
                <th>State</th>
                <td>{property.state}</td>
              </tr>

              <tr>
                <th>Pincode</th>
                <td>{property.pincode}</td>
              </tr>

              <tr>
                <th>Latitude</th>
                <td>{property.latitude}</td>
              </tr>

              <tr>
                <th>Longitude</th>
                <td>{property.longitude}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span
                    className={`badge ${
                      property.verification_status === "Verified"
                        ? "bg-success"
                        : property.verification_status === "Rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {property.verification_status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Created Date</th>
                <td>{new Date(property.created_at).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Google Map */}
          {property.latitude && property.longitude && (
            <>
              <h4 className="mt-4 mb-3">Geo-tag Location</h4>

              <iframe
                title="Property Location"
                width="100%"
                height="350"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`}
              ></iframe>

              <div className="mt-3">
                <a
                  href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  📍 Open in Google Maps
                </a>
              </div>
            </>
          )}

          <hr />

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/properties")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}