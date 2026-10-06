
import React, { useEffect, useState } from "react";
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

const FieldExecutiveProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    properties,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.fieldExecutiveProperty
  );

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // =====================================================
  // LOAD PROPERTIES
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveProperties()
    );
  }, [dispatch]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT ASSIGNMENT STATUS
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "pending") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (value === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#E9ECEF",
      color: "#495057",
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
          property.property_type || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.address || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.city || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(
          property.assignment_status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalProperties =
    properties.length;

  const completedProperties =
    properties.filter(
      (property) =>
        String(
          property.assignment_status || ""
        ).toLowerCase() ===
        "completed"
    ).length;

  const pendingProperties =
    properties.filter(
      (property) =>
        String(
          property.assignment_status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  // =====================================================
  // VIEW PROPERTY
  // =====================================================

  const handleViewProperty = (id) => {
    navigate(
      `/field/properties/${id}`
    );
  };

  // =====================================================
  // ROUTE NAVIGATION
  // =====================================================

  const handleRouteNavigation = (
    property
  ) => {
    if (
      !property.latitude ||
      !property.longitude
    ) {
      alert(
        "Location coordinates are not available for this property."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${property.latitude},${property.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
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
            My Properties
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View properties assigned to you
            for field activities.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            dispatch(
              fetchFieldExecutiveProperties()
            )
          }
          disabled={loading}
          style={{
            border:
              "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />

          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Assigned Properties
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

        {/* COMPLETED */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Completed Assignments
                </small>

                <h3 className="mb-0 mt-2">
                  {completedProperties}
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending Assignments
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingProperties}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#dc3545",
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

            <div className="col-md-8">
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
                  placeholder="Search property, survey number, location or customer..."
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

            <div className="col-md-4">
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
                  All Assignment Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
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
              Assigned Properties
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
                No assigned properties found.
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
                      Type
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Verification
                    </th>

                    <th>
                      Assignment
                    </th>

                    <th>
                      Assigned Date
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map(
                    (property) => (
                      <tr
                        key={
                          property.assignment_id
                        }
                      >
                        {/* ID */}

                        <td className="px-3">
                          {property.property_id}
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {
                              property.property_name
                            }
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
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
                            property.survey_number
                          }
                        </td>

                        {/* TYPE */}

                        <td>
                          {property.property_type ||
                            "-"}
                        </td>

                        {/* LOCATION */}

                        <td>
                          <div className="d-flex align-items-start">
                            <FaMapMarkerAlt
                              className="me-2 mt-1"
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            <div>
                              <strong>
                                {property.city ||
                                  "-"}
                              </strong>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  color:
                                    "#777777",
                                }}
                              >
                                {
                                  property.address
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div className="d-flex align-items-start">
                            <FaUser
                              className="me-2 mt-1"
                              style={{
                                color:
                                  "#777777",
                              }}
                            />

                            <div>
                              <strong>
                                {
                                  property.customer_name ||
                                  "-"
                                }
                              </strong>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  color:
                                    "#777777",
                                }}
                              >
                                {
                                  property.customer_mobile ||
                                  "-"
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* VERIFICATION */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  property.verification_status ||
                                    ""
                                ).toLowerCase() ===
                                "verified"
                                  ? "#DFF5E3"
                                  : "#FFF3CD",

                              color:
                                String(
                                  property.verification_status ||
                                    ""
                                ).toLowerCase() ===
                                "verified"
                                  ? "#198754"
                                  : "#856404",
                            }}
                          >
                            {
                              property.verification_status ||
                              "-"
                            }
                          </span>
                        </td>

                        {/* ASSIGNMENT */}

                        <td>
                          <span
                            className="badge"
                            style={
                              getStatusStyle(
                                property.assignment_status
                              )
                            }
                          >
                            {
                              property.assignment_status ||
                              "-"
                            }
                          </span>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            property.assignment_date
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Property"
                              onClick={() =>
                                handleViewProperty(
                                  property.property_id
                                )
                              }
                              style={{
                                color:
                                  "#C9A227",
                                border:
                                  "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            {/* ROUTE */}

                            <button
                              className="btn btn-sm"
                              title="Navigate to Property"
                              onClick={() =>
                                handleRouteNavigation(
                                  property
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaRoute />
                            </button>
                          </div>
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

export default FieldExecutiveProperties;

