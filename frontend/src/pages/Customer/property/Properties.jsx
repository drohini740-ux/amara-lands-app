
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import socket from "../../../services/socketService";
import {
  fetchProperties,
  removeProperty,
} from "../../../redux/propertySlice";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaMapMarkerAlt,
  FaRedo,
  FaHome,
} from "react-icons/fa";

export default function Properties() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    properties = [],
    loading,
    error,
  } = useSelector((state) => state.property);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchProperties());

    const handlePropertyUpdate = () => {
      dispatch(fetchProperties());
    };

    socket.on("propertyVerificationUpdated", handlePropertyUpdate);

    return () => {
      socket.off("propertyVerificationUpdated", handlePropertyUpdate);
    };
  }, [dispatch]);

  const safeProperties = Array.isArray(properties) ? properties : [];

  const filteredProperties = safeProperties.filter((property) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = [
      property.property_name,
      property.survey_number,
      property.property_type,
      property.city,
      property.state,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const status = String(
      property.verification_status || "Pending"
    ).toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && status === "pending") ||
      (statusFilter === "Verified" &&
        ["verified", "approved"].includes(status)) ||
      (statusFilter === "Rejected" && status === "rejected");

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "Pending").toLowerCase();

    if (["verified", "approved"].includes(normalizedStatus)) {
      return {
        background: "#e8f5e9",
        color: "#23743b",
      };
    }

    if (normalizedStatus === "rejected") {
      return {
        background: "#fdeaea",
        color: "#b42318",
      };
    }

    return {
      background: "#fff4d6",
      color: "#856404",
    };
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      await dispatch(removeProperty(id)).unwrap();
      window.alert("Property deleted successfully.");
    } catch (deleteError) {
      window.alert(
        typeof deleteError === "string"
          ? deleteError
          : deleteError?.message ||
              "Failed to delete property. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const totalProperties = safeProperties.length;
  const pendingProperties = safeProperties.filter(
    (property) =>
      String(property.verification_status || "Pending").toLowerCase() ===
      "pending"
  ).length;

  const verifiedProperties = safeProperties.filter((property) =>
    ["verified", "approved"].includes(
      String(property.verification_status || "").toLowerCase()
    )
  ).length;

  const rejectedProperties = safeProperties.filter(
    (property) =>
      String(property.verification_status || "").toLowerCase() === "rejected"
  ).length;

  if (loading) {
    return (
      <div className="container-fluid p-4 customer-properties">
        <div className="properties-panel text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#D4AF37" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mt-3 mb-1">Loading Properties</h5>
          <p className="text-muted mb-0">
            Please wait while we retrieve your properties.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-3 p-md-4 customer-properties">
        <div className="properties-panel p-4">
          <h4 className="fw-bold">Unable to Load Properties</h4>

          <p className="text-danger">
            {typeof error === "string"
              ? error
              : error?.message ||
                "Something went wrong while loading properties."}
          </p>

          <button
            type="button"
            className="btn properties-btn-gold"
            onClick={() => dispatch(fetchProperties())}
          >
            <FaRedo className="me-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4 customer-properties">
      <style>{`
        .customer-properties {
          color: #171717;
        }

        .properties-heading {
          color: #111111;
          font-size: clamp(24px, 3vw, 30px);
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .properties-subtitle {
          color: #777777;
          font-size: 14px;
        }

        .properties-gold-line {
          width: 58px;
          height: 4px;
          background: #D4AF37;
          border-radius: 5px;
          margin-top: 12px;
        }

        .properties-panel {
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.045);
          overflow: hidden;
        }

        .properties-summary-card {
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 13px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.035);
        }

        .properties-summary-label {
          color: #777777;
          font-size: 12px;
          font-weight: 650;
          margin-bottom: 10px;
        }

        .properties-summary-value {
          color: #111111;
          font-size: 29px;
          font-weight: 750;
          margin-bottom: 0;
        }

        .properties-summary-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #fff4d6;
          color: #997515;
          font-size: 18px;
        }

        .properties-btn-gold {
          background: #D4AF37;
          border: 1px solid #D4AF37;
          color: #111111;
          font-weight: 700;
          border-radius: 8px;
          padding: 10px 16px;
        }

        .properties-btn-gold:hover {
          background: #bd9825;
          border-color: #bd9825;
          color: #111111;
        }

        .properties-search {
          border: 1px solid #dddddd;
          border-radius: 8px;
          padding: 10px 12px;
        }

        .properties-search:focus,
        .properties-filter:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.16);
        }

        .properties-filter {
          border: 1px solid #dddddd;
          border-radius: 8px;
          padding: 10px 12px;
          background-color: #FFFFFF;
        }

        .properties-panel-heading {
          background: #111111;
          color: #FFFFFF;
          padding: 17px 20px;
          border-bottom: 3px solid #D4AF37;
        }

        .properties-panel-heading h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .properties-table {
          margin-bottom: 0;
        }

        .properties-table thead th {
          background: #111111;
          color: #D4AF37;
          border-bottom: 2px solid #D4AF37;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          white-space: nowrap;
          padding: 15px 13px;
        }

        .properties-table tbody td {
          color: #444444;
          font-size: 13px;
          padding: 15px 13px;
          vertical-align: middle;
          border-color: #eeeeee;
        }

        .properties-table tbody tr:hover td {
          background: #fffcf3;
        }

        .properties-name {
          color: #171717;
          font-weight: 700;
        }

        .properties-survey {
          color: #777777;
          font-size: 12px;
        }

        .properties-status {
          display: inline-block;
          border-radius: 20px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .properties-action {
          width: 32px;
          height: 32px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          margin: 2px;
        }

        .properties-action-view {
          background: #111111;
          border: 1px solid #111111;
          color: #D4AF37;
        }

        .properties-action-view:hover {
          background: #333333;
          color: #FFFFFF;
        }

        .properties-action-docs {
          background: #fff4d6;
          border: 1px solid #efd88a;
          color: #856404;
        }

        .properties-action-docs:hover {
          background: #f5e4a9;
          color: #5d4700;
        }

        .properties-action-edit {
          background: #D4AF37;
          border: 1px solid #D4AF37;
          color: #111111;
        }

        .properties-action-edit:hover {
          background: #bd9825;
          color: #111111;
        }

        .properties-action-delete {
          background: #FFFFFF;
          border: 1px solid #e0b8b8;
          color: #b42318;
        }

        .properties-action-delete:hover {
          background: #fdeaea;
          color: #b42318;
        }

        .properties-empty {
          padding: 42px 15px !important;
          text-align: center;
          color: #777777 !important;
        }

        .properties-record-count {
          background: #fff4d6;
          color: #856404;
          border: 1px solid #efd88a;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 767px) {
          .properties-summary-card {
            padding: 16px;
          }

          .properties-table thead th,
          .properties-table tbody td {
            padding: 12px 10px;
          }
        }
      `}</style>

      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <p
            className="text-uppercase fw-bold mb-2"
            style={{
              color: "#A78319",
              fontSize: 11,
              letterSpacing: "1.8px",
            }}
          >
            AMARA LANDS
          </p>

          <h2 className="properties-heading mb-2">
            Property Management
          </h2>

          <p className="properties-subtitle mb-0">
            Manage, search, and track your registered land properties.
          </p>

          <div className="properties-gold-line" />
        </div>

        <button
          type="button"
          className="btn properties-btn-gold"
          onClick={() => navigate("/add-property")}
        >
          <FaPlus className="me-2" />
          Add Property
        </button>
      </div>

      {/* Property summary */}
      <div className="row g-3 mb-4">
        {[
          {
            title: "Total Properties",
            value: totalProperties,
            icon: <FaHome />,
          },
          {
            title: "Pending Verification",
            value: pendingProperties,
            icon: <FaFileAlt />,
          },
          {
            title: "Verified Properties",
            value: verifiedProperties,
            icon: <FaEye />,
          },
          {
            title: "Rejected Properties",
            value: rejectedProperties,
            icon: <FaTrash />,
          },
        ].map((item) => (
          <div className="col-6 col-xl-3" key={item.title}>
            <div className="properties-summary-card">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <p className="properties-summary-label">{item.title}</p>
                  <h3 className="properties-summary-value">
                    {item.value}
                  </h3>
                </div>

                <div className="properties-summary-icon">{item.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="properties-panel mb-4">
        <div className="p-3 p-md-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-8">
              <label className="form-label fw-semibold small">
                Search Properties
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#A78319" }} />
                </span>

                <input
                  type="search"
                  className="form-control properties-search"
                  placeholder="Search by name, survey number, type, or location..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold small">
                Verification Status
              </label>

              <select
                className="form-select properties-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified / Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Property table */}
      <div className="properties-panel">
        <div className="properties-panel-heading d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h5>Property List</h5>
          <span className="properties-record-count">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "Property" : "Properties"}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle properties-table">
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Survey Number</th>
                <th>Type</th>
                <th>Area</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="properties-name">
                        {property.property_name || "Unnamed Property"}
                      </div>
                    </td>

                    <td>{property.survey_number || "—"}</td>

                    <td>{property.property_type || "—"}</td>

                    <td>{property.area ?? "—"}</td>

                    <td>
                      <span className="d-inline-flex align-items-center gap-1">
                        <FaMapMarkerAlt
                          style={{ color: "#A78319", flexShrink: 0 }}
                        />
                        {[property.city, property.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        className="properties-status"
                        style={getStatusStyle(
                          property.verification_status
                        )}
                      >
                        {property.verification_status || "Pending"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center flex-wrap">
                        <button
                          type="button"
                          className="btn properties-action properties-action-view"
                          title="View property"
                          aria-label="View property"
                          onClick={() =>
                            navigate(`/properties/view/${property.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="btn properties-action properties-action-docs"
                          title="Property documents"
                          aria-label="Property documents"
                          onClick={() =>
                            navigate(`/properties/${property.id}/documents`)
                          }
                        >
                          <FaFileAlt />
                        </button>

                        <button
                          type="button"
                          className="btn properties-action properties-action-edit"
                          title="Edit property"
                          aria-label="Edit property"
                          onClick={() =>
                            navigate(`/properties/edit/${property.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="btn properties-action properties-action-delete"
                          title="Delete property"
                          aria-label="Delete property"
                          disabled={deletingId === property.id}
                          onClick={() => handleDelete(property.id)}
                        >
                          {deletingId === property.id ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="properties-empty">
                    <div
                      className="mb-3"
                      style={{ color: "#D4AF37", fontSize: 30 }}
                    >
                      <FaHome />
                    </div>

                    <strong>
                      {search || statusFilter !== "All"
                        ? "No matching properties"
                        : "No properties found"}
                    </strong>

                    <p className="small mt-2 mb-3">
                      {search || statusFilter !== "All"
                        ? "Try changing your search or verification filter."
                        : "Add your first property to get started."}
                    </p>

                    {!search && statusFilter === "All" && (
                      <button
                        type="button"
                        className="btn properties-btn-gold"
                        onClick={() => navigate("/add-property")}
                      >
                        <FaPlus className="me-2" />
                        Add Property
                      </button>
                    )}
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
