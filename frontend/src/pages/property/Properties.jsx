import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProperties, removeProperty } from "../../redux/propertySlice";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Properties() {
  const dispatch = useDispatch();

  const { properties, loading } = useSelector((state) => state.property);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const filteredProperties = properties?.filter((property) => {
    return property.property_name?.toLowerCase().includes(search.toLowerCase());
  });
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeProperty(id)).unwrap();

      alert("Property Deleted Successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Properties...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Property Management</h2>

          <p className="text-muted">Manage your land properties</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-property")}
        >
          <FaPlus className="me-2" />
          Add Property
        </button>
      </div>

      {/* Search */}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search property name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Property Table */}

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Property List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Property Name</th>

                  <th>Survey Number</th>

                  <th>Type</th>

                  <th>Area</th>

                  <th>Location</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProperties && filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.property_name}</td>

                      <td>{property.survey_number}</td>

                      <td>{property.property_type}</td>

                      <td>{property.area}</td>

                      <td>
                        {property.city}, {property.state}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            property.verification_status === "Approved"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {property.verification_status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          title="View"
                          onClick={() =>
                            navigate(`/properties/view/${property.id}`)
                          }
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-secondary me-2"
                          title="Documents"
                          onClick={() =>
                            navigate(`/properties/${property.id}/documents`)
                          }
                        >
                          <FaFileAlt />
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          title="Edit"
                          onClick={() =>
                            navigate(`/properties/edit/${property.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          title="Delete"
                          onClick={() => handleDelete(property.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
