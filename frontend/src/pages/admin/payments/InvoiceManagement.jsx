import { useEffect, useState } from "react";
import {
  FaEye,
  FaPrint,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import api from "../../../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ==========================================
  // Fetch Admin Invoices
  // ==========================================
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/invoices");

      setInvoices(res.data?.invoices || []);
    } catch (error) {
      console.error("Invoice fetch error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Search
  // ==========================================
  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      invoice.invoice_number
        ?.toLowerCase()
        .includes(searchText) ||

      `INV-${invoice.id}`
        .toLowerCase()
        .includes(searchText) ||

      invoice.customer?.name
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.customer_name
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.customer?.email
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.customer_email
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.customer?.mobile
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.customer_mobile
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.property?.name
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.property_name
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.payment_status
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.payment_method
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.transaction_id
        ?.toLowerCase()
        .includes(searchText) ||

      invoice.razorpay_payment_id
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ==========================================
  // View Invoice
  // ==========================================
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  // ==========================================
  // Print Invoice
  // ==========================================
  const printInvoice = (invoice) => {
    setSelectedInvoice(invoice);

    setTimeout(() => {
      window.print();
    }, 300);
  };

  // ==========================================
  // Payment Status Badge
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
        return "bg-success";

      case "Pending":
        return "bg-warning text-dark";

      case "Failed":
        return "bg-danger";

      case "Refunded":
        return "bg-secondary";

      case "Partially Refunded":
        return "bg-info text-dark";

      default:
        return "bg-secondary";
    }
  };

  // ==========================================
  // Download Invoice PDF
  // ==========================================
  const downloadInvoicePDF = async (invoice) => {
    try {
      // Set invoice first
      setSelectedInvoice(invoice);

      // Wait for React to render
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const invoiceElement =
        document.getElementById("printInvoice");

      if (!invoiceElement) {
        alert("Invoice content not found.");
        return;
      }

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 10;

      const imageWidth =
        pageWidth - margin * 2;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      const contentHeight =
        pageHeight - margin * 2;

      let heightLeft = imageHeight;

      let position = margin;

      // First page
      pdf.addImage(
        imageData,
        "PNG",
        margin,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= contentHeight;

      // Additional pages
      while (heightLeft > 0) {
        position =
          margin -
          (imageHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          imageWidth,
          imageHeight
        );

        heightLeft -= contentHeight;
      }

      const invoiceNumber =
        invoice.invoice_number ||
        `INV-${invoice.id}`;

      pdf.save(
        `${invoiceNumber}.pdf`
      );
    } catch (error) {
      console.error(
        "Invoice PDF download error:",
        error
      );

      alert(
        "Unable to download invoice PDF."
      );
    }
  };

  return (
    <div className="container-fluid">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#1f1f1f",
            }}
          >
            Invoice Management
          </h2>

          <p className="text-muted mb-0">
            Manage and view payment invoices
          </p>
        </div>

        <div>
          <span
            className="badge"
            style={{
              background: "#d4af37",
              color: "#fff",
              fontSize: "14px",
              padding: "10px 15px",
            }}
          >
            Total Invoices:{" "}
            {filteredInvoices.length}
          </span>
        </div>

      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}
      <div
        className="card shadow-sm mb-4"
        style={{
          border: "none",
          borderRadius: "12px",
        }}
      >
        <div className="card-body">

          <div className="input-group">

            <span
              className="input-group-text"
              style={{
                background: "#fff",
                border: "2px solid #d4af37",
                borderRight: "none",
              }}
            >
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search invoice, customer, property, status, transaction..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                border: "2px solid #d4af37",
                borderLeft: "none",
                boxShadow: "none",
              }}
            />

          </div>

        </div>
      </div>

      {/* ==========================================
          INVOICE TABLE
      ========================================== */}
      <div
        className="card shadow-sm"
        style={{
          border: "none",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >

        {/* Table Header */}
        <div
          className="card-header"
          style={{
            background: "#d4af37",
            color: "#fff",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          Invoice List
        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead
              style={{
                background: "#1f1f1f",
                color: "#fff",
              }}
            >
              <tr>

                <th>Invoice No</th>

                <th>Customer</th>

                <th>Property</th>

                <th>Amount</th>

                <th>Payment Method</th>

                <th>Status</th>

                <th>Date</th>

                <th>Actions</th>

              </tr>
            </thead>

            <tbody>

              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-5"
                  >
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (

                /* No Data */
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-5"
                  >
                    No invoices found.
                  </td>
                </tr>

              ) : (

                filteredInvoices.map(
                  (invoice) => (

                    <tr key={invoice.id}>

                      {/* Invoice Number */}
                      <td>
                        <strong>
                          {invoice.invoice_number ||
                            `INV-${invoice.id}`}
                        </strong>
                      </td>

                      {/* Customer */}
                      <td>

                        <strong>
                          {invoice.customer?.name ||
                            invoice.customer_name ||
                            "-"}
                        </strong>

                        <br />

                        <small className="text-muted">
                          {invoice.customer?.email ||
                            invoice.customer_email ||
                            "-"}
                        </small>

                      </td>

                      {/* Property */}
                      <td>
                        {invoice.property?.name ||
                          invoice.property_name ||
                          "-"}
                      </td>

                      {/* Amount */}
                      <td>
                        <strong>
                          ₹
                          {Number(
                            invoice.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                      {/* Payment Method */}
                      <td>
                        {invoice.payment_method ||
                          "-"}
                      </td>

                      {/* Status */}
                      <td>

                        <span
                          className={`badge ${getStatusBadge(
                            invoice.payment_status
                          )}`}
                        >
                          {invoice.payment_status ||
                            "-"}
                        </span>

                      </td>

                      {/* Date */}
                      <td>

                        {invoice.payment_date ||
                        invoice.created_at
                          ? new Date(
                              invoice.payment_date ||
                                invoice.created_at
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      {/* Actions */}
                      <td>

                        {/* View */}
                        <button
                          type="button"
                          className="btn btn-sm me-2"
                          style={{
                            background:
                              "#d4af37",
                            color: "#fff",
                          }}
                          onClick={() =>
                            viewInvoice(invoice)
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#invoiceModal"
                          title="View Invoice"
                        >
                          <FaEye />
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          className="btn btn-sm btn-dark me-2"
                          onClick={() =>
                            printInvoice(invoice)
                          }
                          title="Print Invoice"
                        >
                          <FaPrint />
                        </button>

                        {/* Download PDF */}
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            downloadInvoicePDF(
                              invoice
                            )
                          }
                          title="Download Invoice PDF"
                        >
                          <FaDownload />
                        </button>

                      </td>

                    </tr>

                  )
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ==========================================
          INVOICE DETAILS MODAL
      ========================================== */}
      <div
        className="modal fade"
        id="invoiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-lg modal-dialog-centered">

          <div className="modal-content">

            {/* Modal Header */}
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
                Payment Invoice
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />

            </div>

            {/* Modal Body */}
            <div
              className="modal-body"
              style={{
                background: "#fff",
              }}
            >

              {selectedInvoice && (

                <div id="printInvoice">

                  {/* ==========================================
                      COMPANY
                  ========================================== */}
                  <div className="text-center mb-4">

                    <h3
                      style={{
                        fontWeight: "700",
                        color: "#1f1f1f",
                      }}
                    >
                      AMARA LANDS
                    </h3>

                    <p className="text-muted mb-1">
                      Payment Invoice
                    </p>

                    <strong>
                      {selectedInvoice.invoice_number ||
                        `INV-${selectedInvoice.id}`}
                    </strong>

                  </div>

                  {/* ==========================================
                      CUSTOMER + PROPERTY
                  ========================================== */}
                  <div className="row mb-4">

                    {/* Customer */}
                    <div className="col-md-6">

                      <div
                        className="card h-100"
                        style={{
                          border:
                            "1px solid #e5e5e5",
                          borderRadius: "10px",
                        }}
                      >

                        <div
                          className="card-header"
                          style={{
                            background:
                              "#d4af37",
                            color: "#fff",
                            fontWeight: "700",
                          }}
                        >
                          Customer Details
                        </div>

                        <div className="card-body">

                          <p className="mb-2">
                            <strong>
                              Name:
                            </strong>{" "}
                            {selectedInvoice
                              .customer?.name ||
                              selectedInvoice.customer_name ||
                              "-"}
                          </p>

                          <p className="mb-2">
                            <strong>
                              Email:
                            </strong>{" "}
                            {selectedInvoice
                              .customer?.email ||
                              selectedInvoice.customer_email ||
                              "-"}
                          </p>

                          <p className="mb-2">
                            <strong>
                              Mobile:
                            </strong>{" "}
                            {selectedInvoice
                              .customer?.mobile ||
                              selectedInvoice.customer_mobile ||
                              "-"}
                          </p>

                          <p className="mb-0">
                            <strong>
                              Customer ID:
                            </strong>{" "}
                            {selectedInvoice
                              .customer?.id ||
                              selectedInvoice.customer_id ||
                              "-"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Property */}
                    <div className="col-md-6">

                      <div
                        className="card h-100"
                        style={{
                          border:
                            "1px solid #e5e5e5",
                          borderRadius: "10px",
                        }}
                      >

                        <div
                          className="card-header"
                          style={{
                            background:
                              "#1f1f1f",
                            color: "#d4af37",
                            fontWeight: "700",
                          }}
                        >
                          Property Details
                        </div>

                        <div className="card-body">

                          <p className="mb-2">
                            <strong>
                              Property:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.name ||
                              selectedInvoice.property_name ||
                              "-"}
                          </p>

                          <p className="mb-2">
                            <strong>
                              Property ID:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.id ||
                              selectedInvoice.property_id ||
                              "-"}
                          </p>

                          <p className="mb-2">
                            <strong>
                              Survey No:
                            </strong>{" "}
                            {selectedInvoice
                              .property
                              ?.survey_number ||
                              selectedInvoice.survey_number ||
                              "-"}
                          </p>

                          <p className="mb-2">
                            <strong>
                              Type:
                            </strong>{" "}
                            {selectedInvoice
                              .property
                              ?.property_type ||
                              selectedInvoice.property_type ||
                              "-"}
                          </p>

                          <p className="mb-0">
                            <strong>
                              Area:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.area ??
                              selectedInvoice.area ??
                              "-"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ==========================================
                      PROPERTY LOCATION
                  ========================================== */}
                  <div className="card mb-4">

                    <div
                      className="card-header"
                      style={{
                        background:
                          "#f8f9fa",
                        fontWeight: "700",
                        color: "#1f1f1f",
                      }}
                    >
                      Property Location
                    </div>

                    <div className="card-body">

                      <p className="mb-2">
                        <strong>
                          Address:
                        </strong>{" "}
                        {selectedInvoice
                          .property?.address ||
                          selectedInvoice.property_address ||
                          "-"}
                      </p>

                      <div className="row">

                        <div className="col-md-4">
                          <p className="mb-0">
                            <strong>
                              City:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.city ||
                              selectedInvoice.property_city ||
                              "-"}
                          </p>
                        </div>

                        <div className="col-md-4">
                          <p className="mb-0">
                            <strong>
                              State:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.state ||
                              selectedInvoice.property_state ||
                              "-"}
                          </p>
                        </div>

                        <div className="col-md-4">
                          <p className="mb-0">
                            <strong>
                              Pincode:
                            </strong>{" "}
                            {selectedInvoice
                              .property?.pincode ||
                              selectedInvoice.property_pincode ||
                              "-"}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ==========================================
                      PAYMENT INFORMATION
                  ========================================== */}
                  <table className="table table-bordered">

                    <tbody>

                      <tr>
                        <th style={{ width: "35%" }}>
                          Invoice No
                        </th>

                        <td>
                          {selectedInvoice.invoice_number ||
                            `INV-${selectedInvoice.id}`}
                        </td>
                      </tr>

                      <tr>
                        <th>Amount</th>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              selectedInvoice.amount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <th>Purpose</th>

                        <td>
                          {selectedInvoice.payment_for ||
                            "-"}
                        </td>
                      </tr>

                      <tr>
                        <th>Payment Method</th>

                        <td>
                          {selectedInvoice.payment_method ||
                            "-"}
                        </td>
                      </tr>

                      <tr>
                        <th>Status</th>

                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              selectedInvoice.payment_status
                            )}`}
                          >
                            {selectedInvoice.payment_status ||
                              "-"}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <th>Transaction ID</th>

                        <td>
                          {selectedInvoice.transaction_id ||
                            selectedInvoice.razorpay_payment_id ||
                            "-"}
                        </td>
                      </tr>

                      <tr>
                        <th>
                          Razorpay Payment ID
                        </th>

                        <td>
                          {selectedInvoice.razorpay_payment_id ||
                            "-"}
                        </td>
                      </tr>

                      <tr>
                        <th>Payment Date</th>

                        <td>
                          {selectedInvoice.payment_date ||
                          selectedInvoice.created_at
                            ? new Date(
                                selectedInvoice.payment_date ||
                                  selectedInvoice.created_at
                              ).toLocaleString()
                            : "-"}
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* ==========================================
                MODAL FOOTER
            ========================================== */}
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
                onClick={() =>
                  selectedInvoice &&
                  printInvoice(
                    selectedInvoice
                  )
                }
              >
                <FaPrint className="me-1" />
                Print Invoice
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  selectedInvoice &&
                  downloadInvoicePDF(
                    selectedInvoice
                  )
                }
              >
                <FaDownload className="me-1" />
                Download PDF
              </button>

              <button
                type="button"
                className="btn btn-light"
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