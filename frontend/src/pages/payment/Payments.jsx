import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchPayments } from "../../redux/paymentSlice";
import { removePayment } from "../../redux/paymentSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileInvoice,
  FaUndo,
} from "react-icons/fa";
export default function Payments() {
  const dispatch = useDispatch();

  const { payments, loading } = useSelector((state) => state.payment);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?",
    );

    if (!confirmDelete) return;

    dispatch(removePayment(id));
  };

  const filteredPayments = payments.filter((payment) =>
    payment.property_name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <h4>Loading...</h4>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Payment Management</h2>

          <p className="text-muted">Manage all customer payments</p>
        </div>

        <Link to="/payments/add" className="btn btn-primary">
          <FaPlus className="me-2" />
          Add Payment
        </Link>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              className="form-control"
              placeholder="Search Property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Payment List</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Property</th>

                <th>Amount</th>

                <th>Purpose</th>

                <th>Method</th>

                <th>Status</th>
                <th>Payment Date</th>

                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {filteredPayments.length > 0 ? (
    filteredPayments.map((payment) => (
      <tr key={payment.id}>
        <td>{payment.property_name}</td>

        <td>₹ {payment.amount}</td>

        <td>{payment.payment_for}</td>

        <td>{payment.payment_method}</td>

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

        <td>
          {payment.payment_date
            ? payment.payment_date.substring(0, 10)
            : "-"}
        </td>

        <td>
          <Link
            to={`/payments/view/${payment.id}`}
            className="btn btn-info btn-sm me-1"
            title="View"
          >
            <FaEye />
          </Link>

          <Link
            to={`/payments/edit/${payment.id}`}
            className="btn btn-warning btn-sm me-1"
            title="Edit"
          >
            <FaEdit />
          </Link>

          {payment.payment_status === "Success" && (
            <>
              <Link
                to={`/payments/invoice/${payment.id}`}
                className="btn btn-primary btn-sm me-1"
                title="Invoice"
              >
                <FaFileInvoice />
              </Link>

              <Link
                to={`/payments/refund/${payment.id}`}
                className="btn btn-secondary btn-sm me-1"
                title="Refund"
              >
                <FaUndo />
              </Link>
            </>
          )}

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(payment.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
          <Link
  to="/payments/history"
  className="btn btn-primary ms-2"
>
  Payment History
</Link>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center">
        No Payments Found
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
