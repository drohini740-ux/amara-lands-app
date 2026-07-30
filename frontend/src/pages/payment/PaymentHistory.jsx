import { useEffect, useState } from "react";
import api from "../../services/api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const [currentPage, setCurrentPage] = useState(1);
const paymentsPerPage = 5;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data.payments);
    } catch (error) {
      console.log(error);
    }
  };
  const filteredPayments = payments.filter((payment) => {
  const matchSearch =
    payment.property_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    payment.payment_method
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "All" ||
    payment.payment_status === statusFilter;

  return matchSearch && matchStatus;
});
const indexOfLastPayment = currentPage * paymentsPerPage;
const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;

const currentPayments = filteredPayments.slice(
  indexOfFirstPayment,
  indexOfLastPayment
);

const totalPages = Math.ceil(
  filteredPayments.length / paymentsPerPage
);
  const downloadReceipt = async (id) => {
  try {
    const res = await api.get(`/payments/receipt/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", `Receipt-${id}.pdf`);

    document.body.appendChild(link);

    link.click();

    link.remove();
  } catch (err) {
    console.log(err);
    alert("Unable to download receipt");
  }
};

  return (
    <div className="container-fluid">
      <h2 className="payment-title mb-4">Payment History</h2>
<div className="d-flex justify-content-between mb-3">

  <input
    className="form-control"
    style={{ width: "300px" }}
    placeholder="Search Property / Method..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
  />

  <select
    className="form-select"
    style={{ width: "180px" }}
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option>All</option>
    <option>Success</option>
    <option>Pending</option>
    <option>Failed</option>
  </select>

</div>
      <div className="payment-table-card">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>

                <td>{payment.property_name}</td>

                <td>₹{payment.amount}</td>

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

                <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                  onClick={() => downloadReceipt(payment.id)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center mt-4">

  <button
    className="btn btn-warning me-2"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span
    className="align-self-center"
    style={{ fontWeight: "600" }}
  >
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    className="btn btn-warning ms-2"
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

</div>
      </div>
    </div>
  );
}
