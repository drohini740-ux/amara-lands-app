import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function PaymentReceipt() {
  const { id } = useParams();

  const [receiptUrl, setReceiptUrl] = useState("");

  useEffect(() => {
    fetchReceipt();
  }, []);

  const fetchReceipt = async () => {
    try {
      const response = await api.get(`/payments/receipt/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      setReceiptUrl(url);
    } catch (error) {
      console.log(error);
      alert("Unable to load receipt");
    }
  };

  const printReceipt = () => {
    window.open(receiptUrl, "_blank");
  };

  const downloadReceipt = () => {
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = `PaymentReceipt-${id}.html`;
    link.click();
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Payment Receipt</h3>

          <div>
            <button
              className="btn btn-primary me-2"
              onClick={printReceipt}
            >
              Print Receipt
            </button>

            <button
              className="btn btn-success"
              onClick={downloadReceipt}
            >
              Download Receipt
            </button>
          </div>
        </div>

        <div className="card-body">
          {receiptUrl ? (
            <iframe
              src={receiptUrl}
              title="Receipt"
              width="100%"
              height="700"
              style={{ border: "none" }}
            />
          ) : (
            <h5>Loading...</h5>
          )}
        </div>
      </div>
    </div>
  );
}