
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBuilding,
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // =====================================================
  // FETCH PROPERTIES
  // =====================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setProperties(
          response.data.properties || []
        );
      } else {
        setProperties([]);
        setError(
          response.data?.message ||
            "Failed to fetch properties."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Properties Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "verified") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "rejected") {
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

  const filteredProperties =
    properties.filter((property) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          property.property_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.survey_number || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.customer_email || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.city || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.state || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(
          property.verification_status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        String(
          property.property_type || ""
        ).toLowerCase() ===
          typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalProperties =
    properties.length;

  const verifiedProperties =
    properties.filter(
      (property) =>
        String(
          property.verification_status
        ).toLowerCase() === "verified"
    ).length;

  const pendingProperties =
    properties.filter(
      (property) =>
        String(
          property.verification_status
        ).toLowerCase() === "pending"
    ).length;

  const rejectedProperties =
    properties.filter(
      (property) =>
        String(
          property.verification_status
        ).toLowerCase() === "rejected"
    ).length;

  // =====================================================
  // VIEW PROPERTY
  // =====================================================

  const handleView = (id) => {
    navigate(
      `/legal-team/properties/view/${id}`
    );
  };

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Properties
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View properties and related customer
            information for legal review.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchProperties}
          disabled={loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaBuilding className="me-2" />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Properties
                </small>

                <h3 className="mb-0 mt-2">
                  {totalProperties}
                </h3>
              </div>

              <FaBuilding
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* VERIFIED */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft:
                "4px solid #198754",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Verified
                </small>

                <h3 className="mb-0 mt-2">
                  {verifiedProperties}
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#198754",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft:
                "4px solid #FFC107",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingProperties}
                </h3>
              </div>

              <FaHourglassHalf
                style={{
                  color: "#FFC107",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* REJECTED */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft:
                "4px solid #DC3545",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Rejected
                </small>

                <h3 className="mb-0 mt-2">
                  {rejectedProperties}
                </h3>
              </div>

              <FaTimesCircle
                style={{
                  color: "#DC3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color: "#C9A227",
                    }}
                  />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search property, survey number, customer or location..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Verification Status
                </option>

                <option value="Verified">
                  Verified
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            {/* TYPE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Property Types
                </option>

                <option value="Residential">
                  Residential
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Agricultural">
                  Agricultural
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* PROPERTY TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              All Properties
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredProperties.length}{" "}
              properties
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading properties...
              </p>
            </div>
          ) : filteredProperties.length ===
            0 ? (
            <div className="text-center py-5">
              <FaBuilding
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No properties found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Survey No.
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map(
                    (property) => (
                      <tr
                        key={
                          property.id
                        }
                      >
                        <td className="px-3">
                          <strong>
                            #{property.id}
                          </strong>
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {
                              property.property_name ||
                              "-"
                            }
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            Area:{" "}
                            {property.area ||
                              "-"}
                          </div>
                        </td>

                        {/* SURVEY */}

                        <td>
                          {
                            property.survey_number ||
                            "-"
                          }
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <strong>
                            {
                              property.customer_name ||
                              "-"
                            }
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            {
                              property.customer_email ||
                              "-"
                            }
                          </div>
                        </td>

                        {/* LOCATION */}

                        <td>
                          <div>
                            <FaMapMarkerAlt
                              className="me-1"
                              style={{
                                color: "#C9A227",
                              }}
                            />

                            {property.city ||
                              "-"}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {property.state ||
                              "-"}
                          </div>
                        </td>

                        {/* TYPE */}

                        <td>
                          {property.property_type ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                property.verification_status
                              ),
                            }}
                          >
                            {
                              property.verification_status ||
                              "-"
                            }
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="View Property"
                            onClick={() =>
                              handleView(
                                property.id
                              )
                            }
                            style={{
                              color: "#C9A227",
                              border:
                                "1px solid #C9A227",
                              backgroundColor:
                                "#FFFFFF",
                            }}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalTeamProperties;

