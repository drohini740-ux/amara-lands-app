
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaSearch,
  FaSync,
  FaMapMarkerAlt,
  FaEye,
  FaMap,
  FaClipboardList,
} from "react-icons/fa";

import {
  fetchSecurityProperties,
  clearSecurityPropertyError,
} from "../../redux/securityPropertySlice";

const SecurityProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { properties, loading, error } = useSelector(
    (state) => state.securityProperty
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchSecurityProperties());

    return () => {
      dispatch(clearSecurityPropertyError());
    };
  }, [dispatch]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN");
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (["active", "assigned", "completed"].includes(value)) {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (["inactive", "cancelled", "rejected"].includes(value)) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  const filteredProperties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return properties.filter((property) => {
      const searchableText = [
        property.property_name,
        property.survey_number,
        property.property_type,
        property.address,
        property.city,
        property.state,
        property.pincode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchValue);

      const status = String(
        property.assignment_status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalProperties = properties.length;

  const activeAssignments = properties.filter((property) =>
    ["active", "assigned"].includes(
      String(property.assignment_status || "").toLowerCase()
    )
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1 fw-bold" style={{ color: "#111111" }}>
            Assigned Properties
          </h3>

          <p className="mb-0" style={{ color: "#777777" }}>
            View properties assigned to your Security account.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => dispatch(fetchSecurityProperties())}
          disabled={loading}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#C9A227",
            border: "1px solid #C9A227",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #C9A227" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Total Assigned Properties</small>
                <h3 className="fw-bold mt-2 mb-0">{totalProperties}</h3>
              </div>

              <FaBuilding style={{ color: "#C9A227", fontSize: 30 }} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #198754" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Active Assignments</small>
                <h3 className="fw-bold mt-2 mb-0">{activeAssignments}</h3>
              </div>

              <FaClipboardList
                style={{ color: "#198754", fontSize: 30 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#C9A227" }} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search property, survey number, address..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Assignment Statuses</option>
                <option value="active">Active</option>
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(fetchSecurityProperties())}
          >
            Retry
          </button>
        </div>
      )}

      {/* PROPERTIES TABLE */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <strong style={{ color: "#111111" }}>
              Property Assignment List
            </strong>

            <small className="text-muted">
              Showing {filteredProperties.length} of {totalProperties} properties
            </small>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && properties.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />
              <p className="mt-3 mb-0 text-muted">
                Loading assigned properties...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-5 px-3">
              <FaBuilding
                style={{ color: "#CCCCCC", fontSize: 42 }}
              />

              <h5 className="mt-3">
                {properties.length === 0
                  ? "No properties assigned yet"
                  : "No matching properties found"}
              </h5>

              <p className="text-muted mb-3">
                {properties.length === 0
                  ? "Properties will appear here after an administrator assigns them to your Security account."
                  : "Try changing your search term or assignment status filter."}
              </p>

              {properties.length === 0 && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => dispatch(fetchSecurityProperties())}
                  disabled={loading}
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <FaSync className="me-2" />
                  Check Again
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">Property</th>
                    <th>Survey Number</th>
                    <th>Location</th>
                    <th>Assignment Type</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.assignment_id}>
                      <td className="px-3">
                        <strong>
                          {property.property_name || "Unnamed Property"}
                        </strong>

                        <div className="small text-muted">
                          {property.property_type || "Property"}
                          {property.area ? ` • ${property.area} acres` : ""}
                        </div>
                      </td>

                      <td>{property.survey_number || "-"}</td>

                      <td>
                        <div>
                          <FaMapMarkerAlt
                            className="me-1"
                            style={{ color: "#C9A227" }}
                          />
                          {property.city || property.address || "-"}
                        </div>

                        <small className="text-muted">
                          {[property.state, property.pincode]
                            .filter(Boolean)
                            .join(", ") || "Location not provided"}
                        </small>
                      </td>

                      <td>{property.assignment_type || "-"}</td>

                      <td>{formatDate(property.assignment_date)}</td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(property.assignment_status)}
                        >
                          {property.assignment_status || "Unknown"}
                        </span>
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm"
                          title="View property"
                          onClick={() =>
                            navigate(
                              `/security/properties/${property.property_id}`
                            )
                          }
                          style={{
                            color: "#C9A227",
                            border: "1px solid #C9A227",
                          }}
                        >
                          <FaEye className="me-1" />
                          View
                        </button>

                        {property.latitude != null &&
                          property.longitude != null && (
                            <a
                              className="btn btn-sm ms-1"
                              title="View location on map"
                              href={`https://www.google.com/maps?q=${encodeURIComponent(
                                `${property.latitude},${property.longitude}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "#111111",
                                border: "1px solid #111111",
                              }}
                            >
                              <FaMap />
                            </a>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityProperties;

