
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaSync,
  FaRoute,
  FaUser,
} from "react-icons/fa";

import {
  fetchFieldExecutiveProperties,
} from "../../redux/fieldExecutivePropertySlice";

const GOLD = "#C9A227";

const FieldExecutiveProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const propertyState = useSelector(
    (state) => state.fieldExecutiveProperty || {}
  );

  const properties = Array.isArray(propertyState.properties)
    ? propertyState.properties
    : [];

  const loading = Boolean(propertyState.loading);
  const error = propertyState.error;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadProperties = useCallback(() => {
    dispatch(fetchFieldExecutiveProperties());
  }, [dispatch]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return { backgroundColor: "#DFF5E3", color: "#198754" };
    }

    if (value === "pending") {
      return { backgroundColor: "#FFF3CD", color: "#856404" };
    }

    if (value === "cancelled") {
      return { backgroundColor: "#F8D7DA", color: "#842029" };
    }

    return { backgroundColor: "#E9ECEF", color: "#495057" };
  };

  const filteredProperties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return properties.filter((property) => {
      const searchableFields = [
        property.property_name,
        property.survey_number,
        property.property_type,
        property.address,
        property.city,
        property.state,
        property.customer_name,
      ];

      const matchesSearch =
        !searchValue ||
        searchableFields.some((field) =>
          String(field || "").toLowerCase().includes(searchValue)
        );

      const matchesStatus =
        statusFilter === "all" ||
        String(property.assignment_status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  const completedProperties = properties.filter(
    (property) =>
      String(property.assignment_status || "").toLowerCase() === "completed"
  ).length;

  const pendingProperties = properties.filter(
    (property) =>
      String(property.assignment_status || "").toLowerCase() === "pending"
  ).length;

  const handleViewProperty = (propertyId) => {
    if (!propertyId) {
      window.alert("Property ID is unavailable.");
      return;
    }

    navigate(`/field/properties/${propertyId}`);
  };

  const handleRouteNavigation = (property) => {
    const latitude = Number(property.latitude);
    const longitude = Number(property.longitude);

    if (
      property.latitude === null ||
      property.latitude === undefined ||
      property.latitude === "" ||
      property.longitude === null ||
      property.longitude === undefined ||
      property.longitude === "" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      window.alert(
        "Valid location coordinates are not available for this property."
      );
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1 fw-bold" style={{ color: "#111111" }}>
            My Properties
          </h3>

          <p className="mb-0 text-muted">
            View properties assigned to you for field activities.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={loadProperties}
          disabled={loading}
          style={{
            border: `1px solid ${GOLD}`,
            color: GOLD,
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className={`me-2 ${loading ? "fa-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: `4px solid ${GOLD}` }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Assigned Properties</small>
                <h3 className="mb-0 mt-2">{properties.length}</h3>
              </div>
              <FaBuilding style={{ color: GOLD, fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: "4px solid #28a745" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Completed Assignments</small>
                <h3 className="mb-0 mt-2">{completedProperties}</h3>
              </div>
              <FaCheckCircle style={{ color: "#28a745", fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm h-100"
            style={{ borderLeft: "4px solid #dc3545" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Pending Assignments</small>
                <h3 className="mb-0 mt-2">{pendingProperties}</h3>
              </div>
              <FaClock style={{ color: "#dc3545", fontSize: 28 }} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: GOLD }} />
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search property, survey number, location or customer..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search assigned properties"
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by assignment status"
              >
                <option value="all">All Assignment Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={loadProperties}
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* PROPERTY TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <strong>Assigned Properties</strong>
            <span className="text-muted small">
              Showing {filteredProperties.length} of {properties.length} properties
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && properties.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
                style={{ color: GOLD }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 mb-0">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-5">
              <FaBuilding style={{ fontSize: 40, color: "#CCCCCC" }} />
              <p className="mt-3 mb-0 text-muted">
                {properties.length === 0
                  ? "No properties are currently assigned to you."
                  : "No properties match your search or status filter."}
              </p>
              {search || statusFilter !== "all" ? (
                <button
                  type="button"
                  className="btn btn-sm mt-3"
                  style={{ border: `1px solid ${GOLD}`, color: GOLD }}
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>
                  <tr>
                    <th className="px-3">ID</th>
                    <th>Property</th>
                    <th>Survey No.</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Customer</th>
                    <th>Verification</th>
                    <th>Assignment</th>
                    <th>Assigned Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map((property, index) => (
                    <tr
                      key={
                        property.assignment_id ??
                        `${property.property_id ?? "property"}-${index}`
                      }
                    >
                      <td className="px-3">{property.property_id ?? "-"}</td>

                      <td>
                        <strong>{property.property_name || "Unnamed Property"}</strong>
                        <div className="small text-muted">
                          Area: {property.area || "-"}
                        </div>
                      </td>

                      <td>{property.survey_number || "-"}</td>
                      <td>{property.property_type || "-"}</td>

                      <td>
                        <div className="d-flex align-items-start">
                          <FaMapMarkerAlt
                            className="me-2 mt-1 flex-shrink-0"
                            style={{ color: GOLD }}
                          />
                          <div>
                            <strong>{property.city || "-"}</strong>
                            <div className="small text-muted">
                              {property.address || "-"}
                            </div>
                            {property.state ? (
                              <div className="small text-muted">
                                {property.state}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="d-flex align-items-start">
                          <FaUser
                            className="me-2 mt-1 flex-shrink-0"
                            style={{ color: "#777777" }}
                          />
                          <div>
                            <strong>{property.customer_name || "-"}</strong>
                            <div className="small text-muted">
                              {property.customer_mobile || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(property.verification_status)}
                        >
                          {property.verification_status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(property.assignment_status)}
                        >
                          {property.assignment_status || "Unknown"}
                        </span>
                      </td>

                      <td>{formatDate(property.assignment_date)}</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="View Property"
                            aria-label={`View ${property.property_name || "property"}`}
                            onClick={() => handleViewProperty(property.property_id)}
                            disabled={!property.property_id}
                            style={{
                              color: GOLD,
                              border: `1px solid ${GOLD}`,
                            }}
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Navigate to Property"
                            aria-label={`Navigate to ${property.property_name || "property"}`}
                            onClick={() => handleRouteNavigation(property)}
                            style={{
                              color: "#111111",
                              border: "1px solid #111111",
                            }}
                          >
                            <FaRoute />
                          </button>
                        </div>
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

export default FieldExecutiveProperties;
