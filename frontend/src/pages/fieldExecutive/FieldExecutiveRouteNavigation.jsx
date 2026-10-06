
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaRoute,
  FaSearch,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaBuilding,
  FaCompass,
  FaSync,
} from "react-icons/fa";

import {
  fetchFieldExecutiveProperties,
} from "../../redux/fieldExecutivePropertySlice";

const FieldExecutiveRouteNavigation = () => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    properties,
    loading,
    error,
  } = useSelector(
    (state) => state.fieldExecutiveProperty
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  // =====================================================
  // LOAD ASSIGNED PROPERTIES
  // =====================================================

  useEffect(() => {
    dispatch(fetchFieldExecutiveProperties());
  }, [dispatch]);

  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  const filteredProperties = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return properties || [];
    }

    return (properties || []).filter(
      (property) =>
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
          property.state || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          property.pincode || ""
        )
          .toLowerCase()
          .includes(searchValue)
    );
  }, [properties, search]);

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const getCurrentLocation = () => {
    return new Promise(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(
            new Error(
              "Geolocation is not supported by this browser."
            )
          );

          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude:
                position.coords.latitude,

              longitude:
                position.coords.longitude,
            });
          },

          (error) => {
            let message =
              "Unable to get your current location.";

            if (error.code === 1) {
              message =
                "Location permission was denied. Please allow location access.";
            }

            if (error.code === 2) {
              message =
                "Your current location could not be determined.";
            }

            if (error.code === 3) {
              message =
                "Location request timed out. Please try again.";
            }

            reject(
              new Error(message)
            );
          },

          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      }
    );
  };

  // =====================================================
  // NAVIGATE TO PROPERTY
  // =====================================================

  const handleNavigate = async (
    property
  ) => {
    if (
      !property?.latitude ||
      !property?.longitude
    ) {
      alert(
        "Property location coordinates are not available."
      );

      return;
    }

    try {
      setLocationLoading(true);
      setLocationError("");

      const currentLocation =
        await getCurrentLocation();

      const destination =
        `${property.latitude},${property.longitude}`;

      const origin =
        `${currentLocation.latitude},${currentLocation.longitude}`;

      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${origin}` +
        `&destination=${destination}` +
        `&travelmode=driving`;

      window.open(
        mapsUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "Route navigation error:",
        error
      );

      setLocationError(
        error?.message ||
          "Unable to get your current location."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // =====================================================
  // SELECT PROPERTY
  // =====================================================

  const handleSelectProperty = (
    property
  ) => {
    setSelectedProperty(property);
    setLocationError("");
  };

  // =====================================================
  // CLEAR SELECTION
  // =====================================================

  const handleClearSelection = () => {
    setSelectedProperty(null);
    setLocationError("");
  };

  // =====================================================
  // RETURN
  // =====================================================

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
            Route Navigation
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Navigate to your assigned
            properties using Google Maps.
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
            backgroundColor:
              "#FFFFFF",
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
        {/* ASSIGNED PROPERTIES */}

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
                  {properties?.length ||
                    0}
                </h3>
              </div>

              <FaBuilding
                style={{
                  color:
                    "#C9A227",
                  fontSize:
                    "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* LOCATIONS AVAILABLE */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Locations Available
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    (
                      properties ||
                      []
                    ).filter(
                      (property) =>
                        property.latitude &&
                        property.longitude
                    ).length
                  }
                </h3>
              </div>

              <FaMapMarkerAlt
                style={{
                  color:
                    "#111111",
                  fontSize:
                    "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* SEARCH RESULTS */}

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
                  Search Results
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    filteredProperties.length
                  }
                </h3>
              </div>

              <FaRoute
                style={{
                  color:
                    "#28a745",
                  fontSize:
                    "28px",
                }}
              />
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

      {locationError && (
        <div className="alert alert-danger">
          <strong>
            Location Error:
          </strong>{" "}
          {locationError}
        </div>
      )}

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaSearch
                style={{
                  color:
                    "#C9A227",
                }}
              />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search property, survey number, address, city or pincode..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SELECTED PROPERTY */}
      {/* ================================================= */}

      {selectedProperty && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderTop:
              "4px solid #C9A227",
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted">
                  Selected Destination
                </small>

                <h4
                  className="mt-1 mb-1"
                  style={{
                    fontWeight:
                      "700",
                  }}
                >
                  {
                    selectedProperty.property_name ||
                    "-"
                  }
                </h4>

                <div
                  className="text-muted"
                  style={{
                    fontSize:
                      "14px",
                  }}
                >
                  Survey No:{" "}
                  {selectedProperty.survey_number ||
                    "-"}
                </div>
              </div>

              <button
                className="btn btn-sm"
                onClick={
                  handleClearSelection
                }
                style={{
                  border:
                    "1px solid #111111",
                  color:
                    "#111111",
                  backgroundColor:
                    "#FFFFFF",
                }}
              >
                Clear
              </button>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-8">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor:
                      "#F8F8F8",
                  }}
                >
                  <small className="text-muted">
                    Destination
                  </small>

                  <div className="mt-1">
                    <FaMapMarkerAlt
                      className="me-2"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    {[
                      selectedProperty.address,
                      selectedProperty.city,
                      selectedProperty.state,
                      selectedProperty.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                      "Address not available"}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor:
                      "#F8F8F8",
                  }}
                >
                  <small className="text-muted">
                    Coordinates
                  </small>

                  <div
                    className="mt-1"
                    style={{
                      fontSize:
                        "13px",
                    }}
                  >
                    {selectedProperty.latitude ||
                      "-"}
                    ,{" "}
                    {selectedProperty.longitude ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>

            <button
              className="btn mt-3"
              onClick={() =>
                handleNavigate(
                  selectedProperty
                )
              }
              disabled={
                locationLoading
              }
              style={{
                backgroundColor:
                  "#111111",
                color:
                  "#FFFFFF",
                border:
                  "1px solid #111111",
              }}
            >
              <FaLocationArrow className="me-2" />

              {locationLoading
                ? "Getting your location..."
                : "Start Navigation"}
            </button>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PROPERTY LIST */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              <FaRoute
                className="me-2"
                style={{
                  color:
                    "#C9A227",
                }}
              />

              Assigned Routes
            </strong>

            <span
              style={{
                color:
                  "#777777",
                fontSize:
                  "14px",
              }}
            >
              Showing{" "}
              {
                filteredProperties.length
              }{" "}
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
                  color:
                    "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading assigned
                properties...
              </p>
            </div>
          ) : filteredProperties.length ===
            0 ? (
            <div className="text-center py-5">
              <FaRoute
                style={{
                  fontSize:
                    "40px",
                  color:
                    "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No assigned properties
                found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
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
                      Location
                    </th>

                    <th>
                      Coordinates
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-center">
                      Navigation
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map(
                    (property) => {
                      const hasLocation =
                        property.latitude &&
                        property.longitude;

                      return (
                        <tr
                          key={
                            property.assignment_id ||
                            property.property_id
                          }
                        >
                          <td className="px-3">
                            {property.property_id ||
                              "-"}
                          </td>

                          <td>
                            <div>
                              <strong>
                                {property.property_name ||
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
                                {property.property_type ||
                                  "-"}
                              </div>
                            </div>
                          </td>

                          <td>
                            {property.survey_number ||
                              "-"}
                          </td>

                          <td>
                            <div
                              style={{
                                maxWidth:
                                  "250px",
                              }}
                            >
                              <FaMapMarkerAlt
                                className="me-1"
                                style={{
                                  color:
                                    "#C9A227",
                                }}
                              />

                              {[
                                property.address,
                                property.city,
                                property.state,
                                property.pincode,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ", "
                                ) ||
                                "-"}
                            </div>
                          </td>

                          <td>
                            {hasLocation ? (
                              <span
                                style={{
                                  fontSize:
                                    "12px",
                                }}
                              >
                                {
                                  property.latitude
                                }
                                <br />
                                {
                                  property.longitude
                                }
                              </span>
                            ) : (
                              <span className="text-muted">
                                Not available
                              </span>
                            )}
                          </td>

                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#F5E8B0",
                                color:
                                  "#111111",
                              }}
                            >
                              {property.assignment_status ||
                                "Assigned"}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm"
                                onClick={() =>
                                  handleSelectProperty(
                                    property
                                  )
                                }
                                style={{
                                  border:
                                    "1px solid #C9A227",
                                  color:
                                    "#C9A227",
                                  backgroundColor:
                                    "#FFFFFF",
                                }}
                                title="Select Route"
                              >
                                <FaCompass />
                              </button>

                              <button
                                className="btn btn-sm"
                                onClick={() =>
                                  handleNavigate(
                                    property
                                  )
                                }
                                disabled={
                                  !hasLocation ||
                                  locationLoading
                                }
                                style={{
                                  backgroundColor:
                                    "#111111",
                                  color:
                                    "#FFFFFF",
                                  border:
                                    "1px solid #111111",
                                }}
                                title="Navigate"
                              >
                                <FaLocationArrow />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION INFORMATION */}
      {/* ================================================= */}

      <div
        className="card border-0 shadow-sm mt-4"
        style={{
          borderLeft:
            "4px solid #C9A227",
        }}
      >
        <div className="card-body">
          <div className="d-flex align-items-start">
            <FaCompass
              style={{
                color:
                  "#C9A227",
                fontSize:
                  "28px",
                marginRight:
                  "15px",
              }}
            />

            <div>
              <h6
                className="mb-1"
                style={{
                  fontWeight:
                    "700",
                }}
              >
                How Route Navigation
                Works
              </h6>

              <p
                className="mb-0 text-muted"
                style={{
                  fontSize:
                    "14px",
                }}
              >
                Select a property or
                click the navigation
                button. The application
                will request your current
                GPS location and open
                Google Maps with your
                current location as the
                starting point and the
                property as the destination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldExecutiveRouteNavigation;

