import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import API from "../../../services/api";
import { toast } from "react-toastify";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ===========================
  // Fetch Properties
  // ===========================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/properties");

      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (error) {
      console.error("Fetch Properties Error:", error);

      toast.error(error.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ===========================
  // Delete Property
  // ===========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) return;

    try {
      const res = await API.delete(`/admin/properties/${id}`);

      if (res.data.success) {
        toast.success("Property deleted successfully");

        setProperties((prev) => prev.filter((property) => property.id !== id));
      }
    } catch (error) {
      console.error("Delete Property Error:", error);

      toast.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  // ===========================
  // Verification Status
  // ===========================
  const handleVerificationChange = async (id, status) => {
  try {
    const res = await API.put(
      `/admin/properties/${id}/verification`,
      {
        verification_status: status,
      }
    );

    if (res.data.success) {
      toast.success(
        "Property verification status updated"
      );

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === id
            ? {
                ...property,
                verification_status: status,
                verified_by: res.data.property.verified_by,
              }
            : property
        )
      );
    }
  } catch (error) {
    console.error(
      "Verification Update Error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to update verification status"
    );
  }
};
  // ===========================
  // Search
  // ===========================
  const filteredProperties = properties.filter((property) => {
    const searchValue = search.toLowerCase();

    return (
      property.property_name?.toLowerCase().includes(searchValue) ||
      property.survey_number?.toLowerCase().includes(searchValue) ||
      property.owner_name?.toLowerCase().includes(searchValue) ||
      property.owner_email?.toLowerCase().includes(searchValue) ||
      property.city?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="container-fluid p-4">
      {/* ================= HEADER ================= */}

      <div className="mb-4">
        <h2 className="fw-bold">Property Management</h2>

        <p className="text-muted">
          Manage and verify all properties in the system
        </p>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search property, owner, survey number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Properties List</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Survey No.</th>
                <th>Type</th>
                <th>Area</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ minWidth: "130px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center p-4">
                    Loading properties...
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.id}</td>

                    <td>
                      <strong>{property.property_name}</strong>
                    </td>

                    <td>{property.survey_number}</td>

                    <td>{property.property_type || "-"}</td>

                    <td>{property.area ? `${property.area}` : "-"}</td>

                    <td>
                      <div>
                        <strong>{property.owner_name}</strong>

                        <br />

                        <small className="text-muted">
                          {property.owner_email}
                        </small>

                        <br />

                        <small className="text-muted">
                          {property.owner_mobile}
                        </small>
                      </div>
                    </td>

                    <td>
                      {property.city}, {property.state}
                    </td>

                    {/* STATUS */}

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={property.verification_status || "Pending"}
                        onChange={(e) =>
                          handleVerificationChange(property.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* CREATED */}

                    <td>
                      {property.created_at
                        ? new Date(property.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="d-flex align-items-center gap-1 flex-nowrap">
                        <Link
                          to={`/admin/properties/view/${property.id}`}
                          className="btn btn-info btn-sm"
                          title="View Property"
                        >
                          <FaEye />
                        </Link>

                        <Link
                          to={`/admin/properties/edit/${property.id}`}
                          className="btn btn-warning btn-sm"
                          title="Edit Property"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(property.id)}
                          title="Delete Property"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-4">
                    No Properties Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
