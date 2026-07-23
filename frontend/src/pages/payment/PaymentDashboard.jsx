import { useEffect, useState } from "react";
import api from "../../services/api";
import PaymentCharts from "./PaymentCharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PaymentMethodChart from "./PaymentMethodChart";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
} from "react-icons/fa";

export default function PaymentDashboard() {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  const [recentPayments, setRecentPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("month");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchStats();
    fetchRecentPayments();
  }, [filter]);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/payments/stats/dashboard?filter=${filter}`);
      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const res = await api.get(`/payments/recent?filter=${filter}`);
      setRecentPayments(res.data.payments);
    } catch (error) {
      console.log(error);
    }
  };
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Amara Lands - Payment Dashboard", 14, 20);

    doc.setFontSize(12);

    doc.text(`Total Revenue: ₹${stats.totalRevenue}`, 14, 40);
    doc.text(`Successful Payments: ${stats.successfulPayments}`, 14, 50);
    doc.text(`Pending Payments: ${stats.pendingPayments}`, 14, 60);
    doc.text(`Failed Payments: ${stats.failedPayments}`, 14, 70);
    doc.text(`Total Payments: ${stats.totalPayments}`, 14, 80);

    autoTable(doc, {
      startY: 95,
      head: [["Property", "Amount", "Status", "Date"]],
      body: recentPayments.map((payment) => [
        payment.property_name,
        `₹${payment.amount}`,
        payment.payment_status,
        new Date(payment.created_at).toLocaleDateString(),
      ]),
    });

    doc.save("PaymentDashboard.pdf");
  };
  const exportExcel = () => {
    const data = recentPayments.map((payment) => ({
      Property: payment.property_name,
      Amount: payment.amount,
      Status: payment.payment_status,
      Date: new Date(payment.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "PaymentDashboard.xlsx");
  };
  const filteredPayments = recentPayments
    .filter((payment) => {
      return (
        payment.property_name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.payment_method?.toLowerCase().includes(search.toLowerCase()) ||
        payment.payment_status?.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amountHigh":
          return Number(b.amount) - Number(a.amount);

        case "amountLow":
          return Number(a.amount) - Number(b.amount);

        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);

        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="payment-title mb-0">Payment Dashboard</h2>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            style={{
              width: "220px",
              border: "2px solid #d4af37",
              fontWeight: "600",
            }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <select
            className="form-select"
            style={{
              width: "220px",
              border: "2px solid #d4af37",
              fontWeight: "600",
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="amountHigh">Amount High → Low</option>
            <option value="amountLow">Amount Low → High</option>
          </select>
          <button
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

          <button
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
      {/* Dashboard Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="payment-card">
            <div className="icon">
              <FaMoneyBillWave />
            </div>
            <h6>Total Revenue</h6>
            <h2>₹{stats.totalRevenue}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="payment-card">
            <div className="icon">
              <FaCheckCircle />
            </div>
            <h6>Successful Payments</h6>
            <h2>{stats.successfulPayments}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="payment-card">
            <div className="icon">
              <FaClock />
            </div>
            <h6>Pending Payments</h6>
            <h2>{stats.pendingPayments}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="payment-card">
            <div className="icon">
              <FaTimesCircle />
            </div>
            <h6>Failed Payments</h6>
            <h2>{stats.failedPayments}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="payment-card">
            <div className="icon">
              <FaCreditCard />
            </div>
            <h6>Total Payments</h6>
            <h2>{stats.totalPayments}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-5">
        <PaymentCharts stats={stats} />

        <PaymentMethodChart />
      </div>

      {/* Recent Payments */}
      <div className="payment-table-card mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Recent Payments</h4>

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Property</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="modal"
                  data-bs-target="#paymentDetailsModal"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <td>{payment.property_name}</td>

                  <td>₹{payment.amount}</td>

                  <td>
                    <span
                      className={`badge ${
                        payment.payment_status === "Success"
                          ? "bg-success"
                          : payment.payment_status === "Pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                      }`}
                    >
                      {payment.payment_status}
                    </span>
                  </td>

                  <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No matching payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Payment Details Modal */}

      <div
        className="modal fade"
        id="paymentDetailsModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{
                background: "#1f1f1f",
                color: "#d4af37",
                borderBottom: "2px solid #d4af37",
              }}
            >
              <h5 className="modal-title">Payment Details</h5>

              <button
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

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
                    <strong>Property</strong>
                    <br />
                    {selectedPayment.property_name}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Amount</strong>
                    <br />₹{selectedPayment.amount}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Status</strong>
                    <br />
                    {selectedPayment.payment_status}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Method</strong>
                    <br />
                    {selectedPayment.payment_method}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Transaction ID</strong>
                    <br />
                    {selectedPayment.transaction_id || "-"}
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Date</strong>
                    <br />
                    {new Date(selectedPayment.created_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div
              className="modal-footer"
              style={{
                background: "#1f1f1f",
                borderTop: "2px solid #d4af37",
              }}
            >
              <button className="btn btn-warning" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
