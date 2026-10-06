
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaEye,
  FaSync,
  FaSpinner,
} from "react-icons/fa";

import {
  fetchFieldExecutiveVerificationProperties,
  fetchFieldExecutiveVerificationProperty,
  verifyFieldExecutiveProperty,
  rejectFieldExecutiveProperty,
  clearSelectedVerificationProperty,
  clearVerificationError,
  clearVerificationSuccess,
} from "../../redux/fieldExecutiveVerificationSlice";

const FieldExecutivePropertyVerification = () => {
  const dispatch = useDispatch();

  const {
    properties,
    selectedProperty,
    loading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveVerification
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showDetails, setShowDetails] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [confirmAction, setConfirmAction] =
    useState(null);

  // =====================================================
  // LOAD PROPERTIES
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveVerificationProperties()
    );

    return () => {
      dispatch(
        clearSelectedVerificationProperty()
      );
      dispatch(clearVerificationError());
      dispatch(clearVerificationSuccess());
    };
  }, [dispatch]);

  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  const filteredProperties =
    properties.filter((property) => {
      const searchValue =
        search.toLowerCase().trim();

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
        String(property.address || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(property.city || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(property.customer_name || "")
          .toLowerCase()
          .includes(searchValue);

      const status =
        String(
          property.verification_status || ""
        ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const verifiedCount =
    properties.filter(
      (property) =>
        String(
          property.verification_status || ""
        ).toLowerCase() === "verified"
    ).length;

  const pendingCount =
    properties.filter(
      (property) =>
        String(
          property.verification_status || ""
        ).toLowerCase() === "pending"
    ).length;

  const rejectedCount =
    properties.filter(
      (property) =>
        String(
          property.verification_status || ""
        ).toLowerCase() === "rejected"
    ).length;

  // =====================================================
  // VIEW PROPERTY
  // =====================================================

  const handleView = async (id) => {
    setShowDetails(true);

    await dispatch(
      fetchFieldExecutiveVerificationProperty(
        id
      )
    );
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {
    setShowDetails(false);

    dispatch(
      clearSelectedVerificationProperty()
    );
  };

  // =====================================================
  // OPEN CONFIRMATION
  // =====================================================

  const handleConfirmOpen = (
    propertyId,
    action
  ) => {
    setConfirmAction({
      propertyId,
      action,
    });

    setShowConfirm(true);
  };

  // =====================================================
  // CLOSE CONFIRMATION
  // =====================================================

  const handleConfirmClose = () => {
    if (actionLoading) {
      return;
    }

    setShowConfirm(false);
    setConfirmAction(null);
  };

  // =====================================================
  // PERFORM VERIFY / REJECT
  // =====================================================

  const handleConfirmAction = async () => {
    if (!confirmAction) {
      return;
    }

    const {
      propertyId,
      action,
    } = confirmAction;

    if (action === "verify") {
      await dispatch(
        verifyFieldExecutiveProperty(
          propertyId
        )
      );
    }

    if (action === "reject") {
      await dispatch(
        rejectFieldExecutiveProperty(
          propertyId
        )
      );
    }

    setShowConfirm(false);
    setConfirmAction(null);

    dispatch(
      fetchFieldExecutiveVerificationProperties()
    );
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(
      fetchFieldExecutiveVerificationProperties()
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(status || "").toLowerCase();

    if (normalizedStatus === "verified") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (normalizedStatus === "rejected") {
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
  // RENDER
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
            Property Verification
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Verify properties assigned to you
            during field operations.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={handleRefresh}
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

        <div className="col-md-3">
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
                  {properties.length}
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
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Verified
                </small>

                <h3 className="mb-0 mt-2">
                  {verifiedCount}
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

        <div className="col-md-3">
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
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingCount}
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

        {/* REJECTED */}

        <div className="col-md-3">
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
                  Rejected
                </small>

                <h3 className="mb-0 mt-2">
                  {rejectedCount}
                </h3>
              </div>

              <FaTimesCircle
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
                  All Verification Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="rejected">
                  Rejected
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

      {actionError && (
        <div className="alert alert-danger">
          {actionError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* ================================================= */}
      {/* TABLE */}
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
                      Survey Number
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Status
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
                          property.property_id
                        }
                      >
                        <td className="px-3">
                          {property.property_id}
                        </td>

                        <td>
                          <strong>
                            {property.property_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {property.property_type ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          {property.survey_number ||
                            "-"}
                        </td>

                        <td>
                          <div>
                            <FaMapMarkerAlt
                              className="me-1"
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            {property.city ||
                              "-"}
                          </div>

                          <small className="text-muted">
                            {property.address ||
                              "-"}
                          </small>
                        </td>

                        <td>
                          <strong>
                            {property.customer_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {property.customer_mobile ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                property.verification_status
                              ),
                            }}
                          >
                            {property.verification_status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Property"
                              onClick={() =>
                                handleView(
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

                            {/* VERIFY */}

                            {String(
                              property.verification_status ||
                                ""
                            ).toLowerCase() ===
                              "pending" && (
                              <button
                                type="button"
                                className="btn btn-sm"
                                title="Verify Property"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleConfirmOpen(
                                    property.property_id,
                                    "verify"
                                  )
                                }
                                style={{
                                  color:
                                    "#198754",
                                  border:
                                    "1px solid #198754",
                                }}
                              >
                                <FaCheckCircle />
                              </button>
                            )}

                            {/* REJECT */}

                            {String(
                              property.verification_status ||
                                ""
                            ).toLowerCase() ===
                              "pending" && (
                              <button
                                type="button"
                                className="btn btn-sm"
                                title="Reject Property"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleConfirmOpen(
                                    property.property_id,
                                    "reject"
                                  )
                                }
                                style={{
                                  color:
                                    "#dc3545",
                                  border:
                                    "1px solid #dc3545",
                                }}
                              >
                                <FaTimesCircle />
                              </button>
                            )}
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

      {/* ================================================= */}
      {/* PROPERTY DETAILS MODAL */}
      {/* ================================================= */}

      {showDetails && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Property Verification Details
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={
                    handleCloseDetails
                  }
                />
              </div>

              {/* BODY */}

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    <p className="mt-3">
                      Loading property details...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {detailsError}
                  </div>
                ) : selectedProperty ? (
                  <div className="row g-4">
                    {/* PROPERTY */}

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor:
                            "#F8F8F8",
                        }}
                      >
                        <h6
                          style={{
                            color:
                              "#C9A227",
                            fontWeight:
                              "700",
                          }}
                        >
                          <FaBuilding className="me-2" />
                          Property Information
                        </h6>

                        <hr />

                        <p className="mb-2">
                          <strong>
                            Property:
                          </strong>{" "}
                          {selectedProperty.property_name ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Survey Number:
                          </strong>{" "}
                          {selectedProperty.survey_number ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Property Type:
                          </strong>{" "}
                          {selectedProperty.property_type ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Area:
                          </strong>{" "}
                          {selectedProperty.area ||
                            "-"}
                        </p>

                        <p className="mb-0">
                          <strong>
                            Status:
                          </strong>{" "}
                          <span
                            className="badge ms-1"
                            style={{
                              ...getStatusStyle(
                                selectedProperty.verification_status
                              ),
                            }}
                          >
                            {selectedProperty.verification_status ||
                              "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* LOCATION */}

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor:
                            "#F8F8F8",
                        }}
                      >
                        <h6
                          style={{
                            color:
                              "#C9A227",
                            fontWeight:
                              "700",
                          }}
                        >
                          <FaMapMarkerAlt className="me-2" />
                          Location
                        </h6>

                        <hr />

                        <p className="mb-2">
                          <strong>
                            Address:
                          </strong>{" "}
                          {selectedProperty.address ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            City:
                          </strong>{" "}
                          {selectedProperty.city ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            State:
                          </strong>{" "}
                          {selectedProperty.state ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Pincode:
                          </strong>{" "}
                          {selectedProperty.pincode ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Latitude:
                          </strong>{" "}
                          {selectedProperty.latitude ||
                            "-"}
                        </p>

                        <p className="mb-0">
                          <strong>
                            Longitude:
                          </strong>{" "}
                          {selectedProperty.longitude ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    {/* CUSTOMER */}

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor:
                            "#F8F8F8",
                        }}
                      >
                        <h6
                          style={{
                            color:
                              "#C9A227",
                            fontWeight:
                              "700",
                          }}
                        >
                          <FaUser className="me-2" />
                          Customer Information
                        </h6>

                        <hr />

                        <p className="mb-2">
                          <strong>
                            Name:
                          </strong>{" "}
                          {selectedProperty.customer_name ||
                            "-"}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Email:
                          </strong>{" "}
                          {selectedProperty.customer_email ||
                            "-"}
                        </p>

                        <p className="mb-0">
                          <strong>
                            Mobile:
                          </strong>{" "}
                          {selectedProperty.customer_mobile ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    {/* VERIFICATION */}

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor:
                            "#F8F8F8",
                        }}
                      >
                        <h6
                          style={{
                            color:
                              "#C9A227",
                            fontWeight:
                              "700",
                          }}
                        >
                          <FaCheckCircle className="me-2" />
                          Verification
                        </h6>

                        <hr />

                        <p className="mb-2">
                          <strong>
                            Current Status:
                          </strong>
                        </p>

                        <span
                          className="badge"
                          style={{
                            ...getStatusStyle(
                              selectedProperty.verification_status
                            ),
                            fontSize:
                              "13px",
                          }}
                        >
                          {selectedProperty.verification_status ||
                            "Pending"}
                        </span>

                        <p className="mt-3 mb-0">
                          <strong>
                            Verified By:
                          </strong>{" "}
                          {selectedProperty.verified_by ||
                            "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Property details not found.
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                {selectedProperty &&
                  String(
                    selectedProperty.verification_status ||
                      ""
                  ).toLowerCase() ===
                    "pending" && (
                    <>
                      <button
                        type="button"
                        className="btn"
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handleConfirmOpen(
                            selectedProperty.property_id ||
                              selectedProperty.id,
                            "verify"
                          )
                        }
                        style={{
                          backgroundColor:
                            "#198754",
                          color: "#FFFFFF",
                        }}
                      >
                        {actionLoading ? (
                          <>
                            <FaSpinner className="fa-spin me-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="me-2" />
                            Verify Property
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn"
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handleConfirmOpen(
                            selectedProperty.property_id ||
                              selectedProperty.id,
                            "reject"
                          )
                        }
                        style={{
                          backgroundColor:
                            "#dc3545",
                          color: "#FFFFFF",
                        }}
                      >
                        <FaTimesCircle className="me-2" />
                        Reject Property
                      </button>
                    </>
                  )}

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseDetails
                  }
                  style={{
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* CONFIRMATION MODAL */}
      {/* ================================================= */}

      {showConfirm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.6)",
            zIndex: 1100,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Confirm Property Action
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={
                    handleConfirmClose
                  }
                  disabled={
                    actionLoading
                  }
                />
              </div>

              <div className="modal-body text-center py-4">
                {confirmAction?.action ===
                "verify" ? (
                  <>
                    <FaCheckCircle
                      style={{
                        fontSize: "45px",
                        color: "#198754",
                      }}
                    />

                    <h5 className="mt-3">
                      Verify this property?
                    </h5>

                    <p className="text-muted mb-0">
                      This will mark the property
                      as verified.
                    </p>
                  </>
                ) : (
                  <>
                    <FaTimesCircle
                      style={{
                        fontSize: "45px",
                        color: "#dc3545",
                      }}
                    />

                    <h5 className="mt-3">
                      Reject this property?
                    </h5>

                    <p className="text-muted mb-0">
                      This will mark the property
                      as rejected.
                    </p>
                  </>
                )}
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleConfirmClose
                  }
                  disabled={
                    actionLoading
                  }
                  style={{
                    border:
                      "1px solid #777777",
                    color: "#555555",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleConfirmAction
                  }
                  disabled={
                    actionLoading
                  }
                  style={{
                    backgroundColor:
                      confirmAction?.action ===
                      "verify"
                        ? "#198754"
                        : "#dc3545",
                    color: "#FFFFFF",
                  }}
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      Processing...
                    </>
                  ) : confirmAction?.action ===
                    "verify" ? (
                    "Yes, Verify"
                  ) : (
                    "Yes, Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldExecutivePropertyVerification;

