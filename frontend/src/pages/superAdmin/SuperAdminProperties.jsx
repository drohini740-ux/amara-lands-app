import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuperAdminProperties,
  fetchSuperAdminPropertyById,
  verifySuperAdminProperty,
  rejectSuperAdminProperty,
  deleteSuperAdminProperty,
} from "../../redux/superAdminPropertySlice";

const SuperAdminProperties = () => {
  const dispatch = useDispatch();

  const { properties, loading, error } = useSelector(
    (state) => state.superAdminProperty,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const totalProperties = properties.length;

  const pendingProperties = properties.filter(
    (property) => property.verification_status === "Pending",
  ).length;

  const verifiedProperties = properties.filter(
    (property) => property.verification_status === "Verified",
  ).length;

  const rejectedProperties = properties.filter(
    (property) => property.verification_status === "Rejected",
  ).length;

  useEffect(() => {
    dispatch(fetchSuperAdminProperties());
  }, [dispatch]);

  const filteredProperties = properties.filter((property) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      property.property_name?.toLowerCase().includes(searchText) ||
      property.survey_number?.toLowerCase().includes(searchText) ||
      property.city?.toLowerCase().includes(searchText) ||
      property.owner_name?.toLowerCase().includes(searchText) ||
      property.owner_email?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || property.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVerify = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to verify this property?",
    );

    if (!confirmed) return;

    await dispatch(verifySuperAdminProperty(id));

    dispatch(fetchSuperAdminProperties());
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this property?",
    );

    if (!confirmed) return;

    await dispatch(rejectSuperAdminProperty(id));

    dispatch(fetchSuperAdminProperties());
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone.",
    );

    if (!confirmed) return;

    await dispatch(deleteSuperAdminProperty(id));
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#F5F5F5",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#111",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Property Management
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            Manage and verify all properties
          </p>
        </div>

        <div
          style={{
            background: "#111",
            color: "#D4AF37",
            padding: "12px 18px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Total Properties: {properties.length}
        </div>
      </div>
      {/* Property Summary Cards */}
      <div
        style={{
          display: "grid",
       gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <SummaryCard
          title="Total Properties"
          value={totalProperties}
          icon="🏠"
        />

        <SummaryCard title="Pending" value={pendingProperties} icon="⏳" />

        <SummaryCard title="Verified" value={verifiedProperties} icon="✓" />

        <SummaryCard title="Rejected" value={rejectedProperties} icon="✕" />
      </div>
      {/* Filters */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search property, survey number, owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "280px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "7px",
            fontSize: "14px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "7px",
            fontSize: "14px",
            minWidth: "160px",
          }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b00020",
            padding: "12px 15px",
            borderRadius: "7px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            color: "#555",
          }}
        >
          Loading properties...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            overflow: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#111",
                  color: "#fff",
                }}
              >
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Survey No.</th>
                <th style={thStyle}>Owner</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Area</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProperties.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#777",
                    }}
                  >
                    No properties found.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td style={tdStyle}>{property.id}</td>

                    <td style={tdStyle}>
                      <strong>{property.property_name}</strong>
                    </td>

                    <td style={tdStyle}>{property.survey_number}</td>

                    <td style={tdStyle}>
                      <div>
                        <strong>{property.owner_name}</strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#777",
                            marginTop: "3px",
                          }}
                        >
                          {property.owner_email}
                        </div>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {property.city}, {property.state}
                    </td>

                    <td style={tdStyle}>{property.property_type || "-"}</td>

                    <td style={tdStyle}>{property.area || "-"}</td>

                    <td style={tdStyle}>
                      <StatusBadge status={property.verification_status} />
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "7px",
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        <button
                          onClick={async () => {
                            const result = await dispatch(
                              fetchSuperAdminPropertyById(property.id),
                            );

                            if (
                              fetchSuperAdminPropertyById.fulfilled.match(
                                result,
                              )
                            ) {
                              setSelectedProperty(result.payload);
                            }
                          }}
                          style={viewButton}
                        >
                          View
                        </button>

                        {property.verification_status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleVerify(property.id)}
                              style={verifyButton}
                            >
                              Verify
                            </button>

                            <button
                              onClick={() => handleReject(property.id)}
                              style={rejectButton}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(property.id)}
                          style={deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedProperty(null)}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "750px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "30px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProperty(null)}
              style={{
                position: "absolute",
                right: "18px",
                top: "15px",
                border: "none",
                background: "transparent",
                fontSize: "25px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h2
              style={{
                marginTop: 0,
                color: "#111",
              }}
            >
              Property Details
            </h2>

            <StatusBadge status={selectedProperty.verification_status} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                marginTop: "25px",
              }}
            >
              <Detail label="Property ID" value={selectedProperty.id} />

              <Detail
                label="Property Name"
                value={selectedProperty.property_name}
              />

              <Detail
                label="Survey Number"
                value={selectedProperty.survey_number}
              />

              <Detail
                label="Property Type"
                value={selectedProperty.property_type}
              />

              <Detail label="Area" value={selectedProperty.area} />

              <Detail label="Owner" value={selectedProperty.owner_name} />

              <Detail label="Mobile" value={selectedProperty.owner_mobile} />

              <Detail label="Email" value={selectedProperty.owner_email} />

              <Detail label="City" value={selectedProperty.city} />

              <Detail label="State" value={selectedProperty.state} />

              <Detail label="Pincode" value={selectedProperty.pincode} />

              <Detail label="Latitude" value={selectedProperty.latitude} />

              <Detail label="Longitude" value={selectedProperty.longitude} />

              <Detail
                label="Verified By"
                value={selectedProperty.verified_by || "-"}
              />

              <Detail
                label="Created At"
                value={
                  selectedProperty.created_at
                    ? new Date(selectedProperty.created_at).toLocaleString()
                    : "-"
                }
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <Detail label="Address" value={selectedProperty.address} />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "30px",
              }}
            >
              {selectedProperty.verification_status === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      handleVerify(selectedProperty.id);
                      setSelectedProperty(null);
                    }}
                    style={modalVerifyButton}
                  >
                    Verify Property
                  </button>

                  <button
                    onClick={() => {
                      handleReject(selectedProperty.id);
                      setSelectedProperty(null);
                    }}
                    style={modalRejectButton}
                  >
                    Reject Property
                  </button>
                </>
              )}

              <button
                onClick={() => setSelectedProperty(null)}
                style={closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const SummaryCard = ({ title, value, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#777",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#111",
        }}
      >
        {value}
      </div>
    </div>

    <div
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "#111",
        color: "#D4AF37",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "700",
      }}
    >
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  let background = "#eee";
  let color = "#333";

  if (status === "Verified") {
    background = "#e6f7e6";
    color = "#168316";
  }

  if (status === "Pending") {
    background = "#fff4cc";
    color = "#9a7200";
  }

  if (status === "Rejected") {
    background = "#ffe5e5";
    color = "#b00020";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "20px",
        background,
        color,
        fontSize: "12px",
        fontWeight: "700",
      }}
    >
      {status}
    </span>
  );
};

const Detail = ({ label, value }) => (
  <div
    style={{
      padding: "12px",
      background: "#F7F7F7",
      borderRadius: "7px",
    }}
  >
    <div
      style={{
        fontSize: "12px",
        color: "#777",
        marginBottom: "5px",
      }}
    >
      {label}
    </div>

    <div
      style={{
        color: "#111",
        fontWeight: "600",
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </div>
  </div>
);

const thStyle = {
  padding: "14px 12px",
  textAlign: "left",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
  color: "#333",
  verticalAlign: "top",
};

const viewButton = {
  background: "#111",
  color: "#fff",
  border: "none",
  padding: "6px 9px",
  borderRadius: "5px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const verifyButton = {
  background: "#D4AF37",
  color: "#111",
  border: "none",
  padding: "6px 9px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const rejectButton = {
  background: "#fff",
  color: "#b00020",
  border: "1px solid #b00020",
  padding: "6px 9px",
  borderRadius: "5px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const deleteButton = {
  background: "#fff",
  color: "#555",
  border: "1px solid #aaa",
  padding: "6px 9px",
  borderRadius: "5px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const modalVerifyButton = {
  background: "#D4AF37",
  color: "#111",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const modalRejectButton = {
  background: "#fff",
  color: "#b00020",
  border: "1px solid #b00020",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};

const closeButton = {
  background: "#111",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default SuperAdminProperties;
