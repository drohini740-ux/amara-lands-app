import { useEffect, useState } from "react";
import api from "../../../services/api";

import PaymentCharts from "../../payment/PaymentCharts";
import PaymentMethodChart from "../../payment/PaymentMethodChart";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Link } from "react-router-dom";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
} from "react-icons/fa";

export default function PaymentDashboard() {
  // ==========================================
  // PAYMENT STATS
  // ==========================================

  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  // ==========================================
  // RECENT PAYMENTS
  // ==========================================

  const [recentPayments, setRecentPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ==========================================
  // SEARCH / FILTER / SORT
  // ==========================================

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("month");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const paymentsPerPage = 5;

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    fetchStats();
    fetchRecentPayments();

    setCurrentPage(1);
  }, [filter]);

  // ==========================================
  // FETCH ADMIN PAYMENT STATISTICS
  // ==========================================

  const fetchStats = async () => {
    try {
      const res = await api.get(
        `/admin/payments/stats/dashboard?filter=${filter}`
      );

      setStats(
        res.data.stats || {
          totalPayments: 0,
          totalRevenue: 0,
          successfulPayments: 0,
          pendingPayments: 0,
          failedPayments: 0,
        }
      );
    } catch (error) {
      console.error(
        "Admin payment stats error:",
        error
      );
    }
  };

  // ==========================================
  // FETCH ADMIN RECENT PAYMENTS
  // ==========================================

  const fetchRecentPayments = async () => {
    try {
      const res = await api.get(
        `/admin/payments/recent?filter=${filter}`
      );

      setRecentPayments(
        res.data.payments || []
      );
    } catch (error) {
      console.error(
        "Admin recent payments error:",
        error
      );
    }
  };

  // ==========================================
  // EXPORT PDF
  // ==========================================

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Amara Lands - Admin Payment Dashboard",
      14,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Total Revenue: Rs.${stats.totalRevenue}`,
      14,
      40
    );

    doc.text(
      `Successful Payments: ${stats.successfulPayments}`,
      14,
      50
    );

    doc.text(
      `Pending Payments: ${stats.pendingPayments}`,
      14,
      60
    );

    doc.text(
      `Failed Payments: ${stats.failedPayments}`,
      14,
      70
    );

    doc.text(
      `Total Payments: ${stats.totalPayments}`,
      14,
      80
    );

    autoTable(doc, {
      startY: 95,

      head: [
        [
          "Property",
          "Amount",
          "Status",
          "Date",
        ],
      ],

      body: recentPayments.map(
        (payment) => [
          payment.property_name || "-",
          `Rs.${payment.amount || 0}`,
          payment.payment_status || "-",
          payment.created_at
            ? new Date(
                payment.created_at
              ).toLocaleDateString()
            : "-",
        ]
      ),
    });

    doc.save(
      "Amara-Lands-Admin-Payment-Dashboard.pdf"
    );
  };

  // ==========================================
  // EXPORT EXCEL
  // ==========================================

  const exportExcel = () => {
    const data = recentPayments.map(
      (payment) => ({
        Property:
          payment.property_name || "-",

        Amount: payment.amount || 0,

        Status:
          payment.payment_status || "-",

        Date: payment.created_at
          ? new Date(
              payment.created_at
            ).toLocaleDateString()
          : "-",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payments"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(
      fileData,
      "Amara-Lands-Admin-Payments.xlsx"
    );
  };

  // ==========================================
  // SEARCH + SORT
  // ==========================================

  const filteredPayments =
    recentPayments
      .filter((payment) => {
        const searchValue =
          search.toLowerCase().trim();

        return (
          payment.property_name
            ?.toLowerCase()
            .includes(searchValue) ||

          payment.payment_method
            ?.toLowerCase()
            .includes(searchValue) ||

          payment.payment_status
            ?.toLowerCase()
            .includes(searchValue)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "amountHigh":
            return (
              Number(b.amount || 0) -
              Number(a.amount || 0)
            );

          case "amountLow":
            return (
              Number(a.amount || 0) -
              Number(b.amount || 0)
            );

          case "oldest":
            return (
              new Date(a.created_at) -
              new Date(b.created_at)
            );

          default:
            return (
              new Date(b.created_at) -
              new Date(a.created_at)
            );
        }
      });

  // ==========================================
  // RESET PAGE WHEN SEARCH / SORT CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const indexOfLastPayment =
    currentPage * paymentsPerPage;

  const indexOfFirstPayment =
    indexOfLastPayment -
    paymentsPerPage;

  const currentPayments =
    filteredPayments.slice(
      indexOfFirstPayment,
      indexOfLastPayment
    );

  const totalPages = Math.ceil(
    filteredPayments.length /
      paymentsPerPage
  );

  // ==========================================
  // PAYMENT STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Success":
        return "bg-success";

      case "Pending":
        return "bg-warning text-dark";

      case "Failed":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container-fluid">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="payment-title mb-1">
            Payment Dashboard
          </h2>

          <p className="text-muted mb-0">
            Manage and monitor all system payments
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">

          {/* FILTER */}

          <select
            className="form-select"
            style={{
              width: "180px",
              border: "2px solid #d4af37",
              fontWeight: "600",
            }}
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="today">
              Today
            </option>

            <option value="week">
              This Week
            </option>

            <option value="month">
              This Month
            </option>

            <option value="year">
              This Year
            </option>
          </select>

          {/* SORT */}

          <select
            className="form-select"
            style={{
              width: "190px",
              border: "2px solid #d4af37",
              fontWeight: "600",
            }}
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="latest">
              Latest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="amountHigh">
              Amount High → Low
            </option>

            <option value="amountLow">
              Amount Low → High
            </option>
          </select>

          {/* VIEW ALL PAYMENTS */}

          <Link
            to="/admin/payments"
            className="btn btn-dark"
          >
            View All Payments
          </Link>

          {/* PDF */}

          <button
            type="button"
            className="btn"
            onClick={exportPDF}
            style={{
              background: "#d4af37",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            📄 PDF
          </button>

          {/* EXCEL */}

          <button
            type="button"
            className="btn btn-dark"
            onClick={exportExcel}
            style={{
              fontWeight: "600",
            }}
          >
            📊 Excel
          </button>

        </div>
      </div>

      {/* ==========================================
          DASHBOARD CARDS
      ========================================== */}

      <div className="row g-4">

        {/* TOTAL REVENUE */}

        <div className="col-md-4">
          <div className="payment-card">

            <div className="icon">
              <FaMoneyBillWave />
            </div>

            <h6>
              Total Revenue
            </h6>

            <h2>
              ₹{stats.totalRevenue}
            </h2>

          </div>
        </div>

        {/* SUCCESSFUL */}

        <div className="col-md-4">
          <div className="payment-card">

            <div className="icon">
              <FaCheckCircle />
            </div>

            <h6>
              Successful Payments
            </h6>

            <h2>
              {stats.successfulPayments}
            </h2>

          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-4">
          <div className="payment-card">

            <div className="icon">
              <FaClock />
            </div>

            <h6>
              Pending Payments
            </h6>

            <h2>
              {stats.pendingPayments}
            </h2>

          </div>
        </div>

        {/* FAILED */}

        <div className="col-md-4">
          <div className="payment-card">

            <div className="icon">
              <FaTimesCircle />
            </div>

            <h6>
              Failed Payments
            </h6>

            <h2>
              {stats.failedPayments}
            </h2>

          </div>
        </div>

        {/* TOTAL PAYMENTS */}

        <div className="col-md-4">
          <div className="payment-card">

            <div className="icon">
              <FaCreditCard />
            </div>

            <h6>
              Total Payments
            </h6>

            <h2>
              {stats.totalPayments}
            </h2>

          </div>
        </div>

      </div>

      {/* ==========================================
          CHARTS
      ========================================== */}

      <div className="mt-5">

        <PaymentCharts
          stats={stats}
        />

        <PaymentMethodChart />

      </div>

      {/* ==========================================
          RECENT PAYMENTS
      ========================================== */}

      <div className="payment-table-card mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="mb-0">
            Recent Payments
          </h4>

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search Property / Status / Method..."
            style={{
              maxWidth: "320px",
              border: "2px solid #d4af37",
              borderRadius: "10px",
            }}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead>
              <tr>
                <th>
                  Property
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {currentPayments.length > 0 ? (

                currentPayments.map(
                  (payment) => (

                    <tr
                      key={payment.id}
                      style={{
                        cursor: "pointer",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#paymentDetailsModal"
                      onClick={() =>
                        setSelectedPayment(
                          payment
                        )
                      }
                    >

                      <td>
                        {payment.property_name ||
                          "-"}
                      </td>

                      <td>
                        ₹{payment.amount || 0}
                      </td>

                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            payment.payment_status
                          )}`}
                        >
                          {payment.payment_status ||
                            "-"}
                        </span>

                      </td>

                      <td>
                        {payment.created_at
                          ? new Date(
                              payment.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center"
                  >
                    No matching payments found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ==========================================
            PAGINATION
        ========================================== */}

        <div className="d-flex justify-content-between align-items-center mt-3">

          <button
            type="button"
            className="btn btn-dark"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
          >
            ← Previous
          </button>

          <span className="fw-bold">
            Page {currentPage} of{" "}
            {totalPages || 1}
          </span>

          <button
            type="button"
            className="btn btn-warning"
            disabled={
              currentPage >=
                totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
          >
            Next →
          </button>

        </div>

      </div>

      {/* ==========================================
          PAYMENT DETAILS MODAL
      ========================================== */}

      <div
        className="modal fade"
        id="paymentDetailsModal"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-lg modal-dialog-centered">

          <div className="modal-content">

            {/* HEADER */}

            <div
              className="modal-header"
              style={{
                background: "#1f1f1f",
                color: "#d4af37",
                borderBottom:
                  "2px solid #d4af37",
              }}
            >

              <h5 className="modal-title">
                Payment Details
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />

            </div>

            {/* BODY */}

            <div
              className="modal-body"
              style={{
                background: "#222",
                color: "#fff",
              }}
            >

              {selectedPayment && (

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <strong>
                      Property
                    </strong>

                    <br />

                    {selectedPayment.property_name ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Amount
                    </strong>

                    <br />

                    ₹
                    {selectedPayment.amount ||
                      0}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Status
                    </strong>

                    <br />

                    {selectedPayment.payment_status ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Method
                    </strong>

                    <br />

                    {selectedPayment.payment_method ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Transaction ID
                    </strong>

                    <br />

                    {selectedPayment.transaction_id ||
                      selectedPayment.razorpay_payment_id ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment Date
                    </strong>

                    <br />

                    {selectedPayment.payment_date
                      ? new Date(
                          selectedPayment.payment_date
                        ).toLocaleString()
                      : "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Created At
                    </strong>

                    <br />

                    {selectedPayment.created_at
                      ? new Date(
                          selectedPayment.created_at
                        ).toLocaleString()
                      : "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Payment For
                    </strong>

                    <br />

                    {selectedPayment.payment_for ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      User
                    </strong>

                    <br />

                    {selectedPayment.full_name ||
                      "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>
                      Email
                    </strong>

                    <br />

                    {selectedPayment.email ||
                      "-"}
                  </div>

                </div>

              )}

            </div>

            {/* FOOTER */}

            <div
              className="modal-footer"
              style={{
                background: "#1f1f1f",
                borderTop:
                  "2px solid #d4af37",
              }}
            >

              <button
                type="button"
                className="btn btn-warning"
                data-bs-dismiss="modal"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}