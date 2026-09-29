import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminPayments,
  fetchSuperAdminPaymentById,
  updateSuperAdminPaymentStatus,
  updateSuperAdminRefundStatus,
  clearSelectedPayment,
} from "../../redux/superAdminPaymentSlice";

const SuperAdminPayments = () => {
  const dispatch = useDispatch();

  const {
    payments,
    selectedPayment,
    loading,
    updateLoading,
    error,
  } = useSelector((state) => state.superAdminPayment);

  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuperAdminPayments());
  }, [dispatch]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(payment.id || "").includes(searchText) ||
        String(payment.user_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(payment.user_mobile || "")
          .toLowerCase()
          .includes(searchText) ||
        String(payment.user_email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(payment.property_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(payment.razorpay_payment_id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(payment.transaction_id || "")
          .toLowerCase()
          .includes(searchText);

      const matchesPaymentStatus =
        paymentStatusFilter === "All" ||
        payment.payment_status === paymentStatusFilter;

      const matchesRefundStatus =
        refundStatusFilter === "All" ||
        payment.refund_status === refundStatusFilter;

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesRefundStatus
      );
    });
  }, [
    payments,
    search,
    paymentStatusFilter,
    refundStatusFilter,
  ]);

  const totalPayments = payments.length;

  const successfulPayments = payments.filter(
    (payment) => payment.payment_status === "Success"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.payment_status === "Pending"
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.payment_status === "Failed"
  ).length;

  const refundedPayments = payments.filter(
    (payment) => payment.payment_status === "Refunded"
  ).length;

  const totalRevenue = payments
    .filter((payment) => payment.payment_status === "Success")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN");
  };

  const handleView = async (id) => {
    const result = await dispatch(
      fetchSuperAdminPaymentById(id)
    );

    if (fetchSuperAdminPaymentById.fulfilled.match(result)) {
      setShowModal(true);
    }
  };

  const handlePaymentStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminPaymentStatus({
        id,
        payment_status: status,
      })
    );
  };

  const handleRefundStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminRefundStatus({
        id,
        refund_status: status,
      })
    );
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(clearSelectedPayment());
  };

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const selectStyle = {
    padding: "9px 12px",
    border: "1px solid #D8D8D8",
    borderRadius: "7px",
    background: "#FFFFFF",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  };

  const statusStyle = (status) => {
    let background = "#F3F3F3";
    let color = "#333333";

    if (status === "Success") {
      background = "#E8F5E9";
      color = "#2E7D32";
    }

    if (status === "Pending") {
      background = "#FFF8E1";
      color = "#A66A00";
    }

    if (status === "Failed") {
      background = "#FFEBEE";
      color = "#C62828";
    }

    if (status === "Refunded") {
      background = "#EDE7F6";
      color = "#6A1B9A";
    }

    if (status === "Processed") {
      background = "#E8F5E9";
      color = "#2E7D32";
    }

    return {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
      background,
      color,
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F5F5",
        padding: "28px",
        color: "#111111",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#B08D2F",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "5px",
            }}
          >
            SUPER ADMIN
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Payment Management
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#777777",
              fontSize: "13px",
            }}
          >
            Monitor payments, transactions and refund statuses.
          </p>
        </div>

        <button
          onClick={() => dispatch(fetchSuperAdminPayments())}
          style={{
            background: "#111111",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "7px",
            padding: "10px 17px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#FFEBEE",
            color: "#C62828",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>TOTAL PAYMENTS</div>
          <div style={numberStyle}>{totalPayments}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>SUCCESSFUL</div>
          <div style={numberStyle}>{successfulPayments}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>PENDING</div>
          <div style={numberStyle}>{pendingPayments}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>FAILED</div>
          <div style={numberStyle}>{failedPayments}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>REFUNDED</div>
          <div style={numberStyle}>{refundedPayments}</div>
        </div>

        <div
          style={{
            ...cardStyle,
            borderTop: "3px solid #B08D2F",
          }}
        >
          <div style={labelStyle}>TOTAL REVENUE</div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginTop: "8px",
              color: "#B08D2F",
            }}
          >
            {formatAmount(totalRevenue)}
          </div>
        </div>
      </div>

      {/* FILTER AREA */}
      <div
        style={{
          ...cardStyle,
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search customer, property, payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1",
              minWidth: "240px",
              padding: "10px 13px",
              border: "1px solid #D8D8D8",
              borderRadius: "7px",
              outline: "none",
              fontSize: "13px",
            }}
          />

          <select
            value={paymentStatusFilter}
            onChange={(e) =>
              setPaymentStatusFilter(e.target.value)
            }
            style={selectStyle}
          >
            <option value="All">All Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={refundStatusFilter}
            onChange={(e) =>
              setRefundStatusFilter(e.target.value)
            }
            style={selectStyle}
          >
            <option value="All">All Refund Status</option>
            <option value="Not Requested">
              Not Requested
            </option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          ...cardStyle,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            fontSize: "17px",
            fontWeight: "700",
            marginBottom: "15px",
          }}
        >
          Payments ({filteredPayments.length})
        </div>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777777",
            }}
          >
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777777",
            }}
          >
            No payments found.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1250px",
            }}
          >
            <thead>
              <tr style={{ background: "#111111" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>CUSTOMER</th>
                <th style={thStyle}>PROPERTY</th>
                <th style={thStyle}>AMOUNT</th>
                <th style={thStyle}>METHOD</th>
                <th style={thStyle}>PAYMENT ID</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>PAYMENT STATUS</th>
                <th style={thStyle}>REFUND STATUS</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td style={tdStyle}>{payment.id}</td>

                  <td style={tdStyle}>
                    <div style={{ fontWeight: "600" }}>
                      {payment.user_name || "-"}
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#777777",
                        marginTop: "3px",
                      }}
                    >
                      {payment.user_mobile || "-"}
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <div style={{ fontWeight: "600" }}>
                      {payment.property_name || "-"}
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#777777",
                        marginTop: "3px",
                      }}
                    >
                      Survey: {payment.survey_number || "-"}
                    </div>
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "700",
                    }}
                  >
                    {formatAmount(payment.amount)}
                  </td>

                  <td style={tdStyle}>
                    {payment.payment_method || "-"}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      fontSize: "11px",
                      maxWidth: "170px",
                    }}
                  >
                    {payment.razorpay_payment_id ||
                      payment.transaction_id ||
                      "-"}
                  </td>

                  <td style={tdStyle}>
                    {formatDate(payment.payment_date)}
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={payment.payment_status || "Pending"}
                      disabled={updateLoading}
                      onChange={(e) =>
                        handlePaymentStatusChange(
                          payment.id,
                          e.target.value
                        )
                      }
                      style={{
                        ...selectStyle,
                        fontSize: "11px",
                        padding: "6px 8px",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={
                        payment.refund_status ||
                        "Not Requested"
                      }
                      disabled={updateLoading}
                      onChange={(e) =>
                        handleRefundStatusChange(
                          payment.id,
                          e.target.value
                        )
                      }
                      style={{
                        ...selectStyle,
                        fontSize: "11px",
                        padding: "6px 8px",
                      }}
                    >
                      <option value="Not Requested">
                        Not Requested
                      </option>
                      <option value="Pending">Pending</option>
                      <option value="Processed">
                        Processed
                      </option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => handleView(payment.id)}
                      style={{
                        background: "#111111",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        padding: "7px 13px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAYMENT DETAILS MODAL */}
      {showModal && selectedPayment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#B08D2F",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  PAYMENT DETAILS
                </div>

                <h2
                  style={{
                    margin: "5px 0 0",
                    fontSize: "22px",
                  }}
                >
                  Payment #{selectedPayment.id}
                </h2>
              </div>

              <button
                onClick={closeModal}
                style={{
                  border: "none",
                  background: "#111111",
                  color: "#FFFFFF",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "15px",
              }}
            >
              <Detail
                label="Customer"
                value={selectedPayment.user_name}
              />

              <Detail
                label="Mobile"
                value={selectedPayment.user_mobile}
              />

              <Detail
                label="Email"
                value={selectedPayment.user_email}
              />

              <Detail
                label="Property"
                value={selectedPayment.property_name}
              />

              <Detail
                label="Survey Number"
                value={selectedPayment.survey_number}
              />

              <Detail
                label="Property Type"
                value={selectedPayment.property_type}
              />

              <Detail
                label="Area"
                value={selectedPayment.area}
              />

              <Detail
                label="Amount"
                value={formatAmount(selectedPayment.amount)}
                highlight
              />

              <Detail
                label="Payment For"
                value={selectedPayment.payment_for}
              />

              <Detail
                label="Payment Method"
                value={selectedPayment.payment_method}
              />

              <Detail
                label="Payment Date"
                value={formatDateTime(
                  selectedPayment.payment_date
                )}
              />

              <Detail
                label="Payment Status"
                value={selectedPayment.payment_status}
              />

              <Detail
                label="Refund Status"
                value={selectedPayment.refund_status}
              />

              <Detail
                label="Razorpay Order ID"
                value={selectedPayment.razorpay_order_id}
              />

              <Detail
                label="Razorpay Payment ID"
                value={selectedPayment.razorpay_payment_id}
              />

              <Detail
                label="Transaction ID"
                value={selectedPayment.transaction_id}
              />

              <Detail
                label="City"
                value={selectedPayment.city}
              />

              <Detail
                label="State"
                value={selectedPayment.state}
              />

              <Detail
                label="Pincode"
                value={selectedPayment.pincode}
              />
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "15px",
                background: "#F8F8F8",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#777777",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                REMARKS
              </div>

              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {selectedPayment.remarks || "No remarks available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value, highlight }) => (
  <div
    style={{
      border: "1px solid #E5E5E5",
      borderRadius: "8px",
      padding: "12px",
    }}
  >
    <div
      style={{
        fontSize: "10px",
        color: "#888888",
        fontWeight: "700",
        marginBottom: "5px",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>

    <div
      style={{
        fontSize: "13px",
        fontWeight: highlight ? "700" : "500",
        color: highlight ? "#B08D2F" : "#222222",
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </div>
  </div>
);

const labelStyle = {
  fontSize: "10px",
  color: "#777777",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const numberStyle = {
  fontSize: "25px",
  fontWeight: "700",
  marginTop: "8px",
};

const thStyle = {
  color: "#FFFFFF",
  padding: "12px 10px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 10px",
  borderBottom: "1px solid #EEEEEE",
  fontSize: "12px",
  verticalAlign: "middle",
};

export default SuperAdminPayments;