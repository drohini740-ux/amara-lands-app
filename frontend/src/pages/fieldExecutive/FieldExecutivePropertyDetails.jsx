
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaRoute,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapPin,
} from "react-icons/fa";

import {
  fetchFieldExecutivePropertyById,
  clearSelectedProperty,
} from "../../redux/fieldExecutivePropertySlice";

const FieldExecutivePropertyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    selectedProperty,
    detailsLoading,
    detailsError,
  } = useSelector(
    (state) => state.fieldExecutiveProperty
  );

  // =====================================================
  // LOAD PROPERTY
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(
        fetchFieldExecutivePropertyById(id)
      );
    }

    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // GOOGLE MAPS
  // =====================================================

  const handleRouteNavigation = () => {
    if (
      !selectedProperty?.latitude ||
      !selectedProperty?.longitude
    ) {
      alert(
        "Location coordinates are not available."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${selectedProperty.latitude},${selectedProperty.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (detailsLoading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 mb-0">
          Loading property details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (detailsError) {
    return (
      <div>
        <button
          className="btn mb-4"
          onClick={() =>
            navigate("/field/properties")
          }
          style={{
            border:
              "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Properties
        </button>

        <div className="alert alert-danger">
          {detailsError}
        </div>
      </div>
    );
  }

  // =====================================================
  // PROPERTY NOT FOUND
  // =====================================================

  if (!selectedProperty) {
    return (
      <div>
        <button
          className="btn mb-4"
          onClick={() =>
            navigate("/field/properties")
          }
          style={{
            border:
              "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Properties
        </button>

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaBuilding
              style={{
                fontSize: "45px",
                color: "#CCCCCC",
              }}
            />

            <p className="mt-3 text-muted mb-0">
              Property details not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn mb-3"
            onClick={() =>
              navigate("/field/properties")
            }
            style={{
              border:
                "1px solid #111111",
              color: "#111111",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaArrowLeft className="me-2" />
            Back to Properties
          </button>

          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            {selectedProperty.property_name}
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Property ID:{" "}
            {selectedProperty.property_id}
          </p>
        </div>

        <button
          className="btn"
          onClick={
            handleRouteNavigation
          }
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border:
              "1px solid #111111",
          }}
        >
          <FaRoute className="me-2" />
          Navigate to Property
        </button>
      </div>

      {/* ================================================= */}
      {/* STATUS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
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
                  Verification Status
                </small>

                <h5 className="mb-0 mt-2">
                  {selectedProperty.verification_status ||
                    "-"}
                </h5>
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

        <div className="col-md-6">
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
                  Assignment Status
                </small>

                <h5 className="mb-0 mt-2">
                  {selectedProperty.assignment_status ||
                    "-"}
                </h5>
              </div>

              <FaCalendarAlt
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* PROPERTY INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <strong>
            Property Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted">
                Property Name
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.property_name ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Survey Number
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.survey_number ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Property Type
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.property_type ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Area
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.area
                  ? `${selectedProperty.area} acres`
                  : "-"}
              </div>
            </div>

            <div className="col-md-8">
              <small className="text-muted">
                Address
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.address ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                City
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.city ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                State
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.state ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Pincode
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.pincode ||
                  "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* LOCATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <strong>
            Property Location
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt
                  className="me-3 mt-1"
                  style={{
                    color: "#C9A227",
                    fontSize: "22px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Address
                  </small>

                  <div className="fw-semibold">
                    {selectedProperty.address ||
                      "-"}
                  </div>

                  <div className="text-muted">
                    {selectedProperty.city},{" "}
                    {selectedProperty.state} -{" "}
                    {selectedProperty.pincode}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <small className="text-muted">
                Latitude
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.latitude ||
                  "-"}
              </div>
            </div>

            <div className="col-md-3">
              <small className="text-muted">
                Longitude
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.longitude ||
                  "-"}
              </div>
            </div>
          </div>

          <button
            className="btn mt-4"
            onClick={
              handleRouteNavigation
            }
            style={{
              backgroundColor: "#C9A227",
              color: "#111111",
              border:
                "1px solid #C9A227",
              fontWeight: "600",
            }}
          >
            <FaMapPin className="me-2" />
            Open Location in Google Maps
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOMER INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <strong>
            Customer Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <FaUser
                  className="me-3"
                  style={{
                    color: "#C9A227",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Customer Name
                  </small>

                  <div className="fw-semibold">
                    {selectedProperty.customer_name ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <FaEnvelope
                  className="me-3"
                  style={{
                    color: "#C9A227",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Email
                  </small>

                  <div className="fw-semibold">
                    {selectedProperty.customer_email ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <FaPhone
                  className="me-3"
                  style={{
                    color: "#C9A227",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Mobile
                  </small>

                  <div className="fw-semibold">
                    {selectedProperty.customer_mobile ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ASSIGNMENT INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <strong>
            Assignment Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted">
                Assignment ID
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.assignment_id ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Assignment Type
              </small>

              <div className="fw-semibold mt-1">
                {selectedProperty.assignment_type ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Assignment Date
              </small>

              <div className="fw-semibold mt-1">
                {formatDate(
                  selectedProperty.assignment_date
                )}
              </div>
            </div>

            <div className="col-12">
              <small className="text-muted">
                Assignment Notes
              </small>

              <div className="mt-1 p-3 bg-light rounded">
                {selectedProperty.notes ||
                  "No assignment notes available."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldExecutivePropertyDetails;

