import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchPayments,
  removePayment,
} from "../../redux/paymentSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileInvoice,
  FaUndo,
  FaHistory,
} from "react-icons/fa";

export default function Payments() {
  const dispatch = useDispatch();

  // ==========================================
  // REDUX PAYMENT STATE
  // ==========================================

  const paymentState = useSelector(
    (state) => state.payment
  );

  const payments = Array.isArray(paymentState?.payments)
    ? paymentState.payments
    : [];

  const loading = paymentState?.loading || false;

  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // FETCH CUSTOMER PAYMENTS
  // ==========================================

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    dispatch(removePayment(id));
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const searchValue = search.toLowerCase().trim();

  const filteredPayments = payments.filter((payment) => {
    return (
      payment.property_name
        ?.toLowerCase()
        .includes(searchValue) ||

      payment.payment_for
        ?.toLowerCase()
        .includes(searchValue) ||

      payment.payment_method
        ?.toLowerCase()
        .includes(searchValue) ||

      payment.payment_status
        ?.toLowerCase()
        .includes(searchValue) ||

      payment.transaction_id
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div
            className="spinner-border text-warning"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

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
          <h2 className="fw-bold">
            Payment Management
          </h2>

          <p className="text-muted mb-0">
            Manage and view your payments
          </p>
        </div>

        <div className="d-flex gap-2">

          {/* ADD PAYMENT */}

          <Link
            to="/payments/add"
            className="btn btn-primary"
          >
            <FaPlus className="me-2" />
            Add Payment
          </Link>

          {/* PAYMENT HISTORY */}

          <Link
            to="/payments/history"
            className="btn btn-dark"
          >
            <FaHistory className="me-2" />
            Payment History
          </Link>

        </div>
      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="card shadow mb-4">

        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search Property / Purpose / Method / Status..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          PAYMENT LIST
      ========================================== */}

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">

          <h5 className="mb-0">
            Payment List
          </h5>

          <span className="text-muted">
            {filteredPayments.length} payment
            {filteredPayments.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        <div className="table-responsive">

          <table className="table table-hover mb-0">

            <thead>
              <tr>

                <th>
                  Property
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Purpose
                </th>

                <th>
                  Method
                </th>

                <th>
                  Status
                </th>

                <th>
                  Payment Date
                </th>

                <th>
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (

                filteredPayments.map((payment) => (

                  <tr key={payment.id}>

                    {/* PROPERTY */}

                    <td>
                      {payment.property_name || "-"}
                    </td>

                    {/* AMOUNT */}

                    <td>
                      ₹{" "}
                      {Number(
                        payment.amount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* PURPOSE */}

                    <td>
                      {payment.payment_for || "-"}
                    </td>

                    {/* METHOD */}

                    <td>
                      {payment.payment_method || "-"}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`badge ${
                          payment.payment_status ===
                          "Success"
                            ? "bg-success"
                            : payment.payment_status ===
                              "Pending"
                            ? "bg-warning text-dark"
                            : payment.payment_status ===
                              "Failed"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {payment.payment_status || "-"}
                      </span>

                    </td>

                    {/* PAYMENT DATE */}

                    <td>

                      {payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleDateString()
                        : payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                    {/* ACTIONS */}

                    <td>

                      {/* VIEW */}

                      <Link
                        to={`/payments/view/${payment.id}`}
                        className="btn btn-info btn-sm me-1"
                        title="View Payment"
                      >
                        <FaEye />
                      </Link>

                      {/* EDIT */}

                      <Link
                        to={`/payments/edit/${payment.id}`}
                        className="btn btn-warning btn-sm me-1"
                        title="Edit Payment"
                      >
                        <FaEdit />
                      </Link>

                      {/* SUCCESS PAYMENT ACTIONS */}

                      {payment.payment_status ===
                        "Success" && (
                        <>

                          {/* INVOICE */}

                          <Link
                            to={`/payments/invoice/${payment.id}`}
                            className="btn btn-primary btn-sm me-1"
                            title="Invoice"
                          >
                            <FaFileInvoice />
                          </Link>

                          {/* REFUND */}

                          <Link
                            to={`/payments/refund/${payment.id}`}
                            className="btn btn-secondary btn-sm me-1"
                            title="Refund"
                          >
                            <FaUndo />
                          </Link>

                        </>
                      )}

                      {/* DELETE */}

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(payment.id)
                        }
                        title="Delete Payment"
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-5"
                  >

                    <div className="text-muted">

                      <FaFileInvoice
                        size={40}
                        className="mb-3"
                      />

                      <h5>
                        No Payments Found
                      </h5>

                      {search ? (
                        <p className="mb-0">
                          No payments match your
                          search.
                        </p>
                      ) : (
                        <p className="mb-0">
                          You don't have any
                          payments yet.
                        </p>
                      )}

                    </div>

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