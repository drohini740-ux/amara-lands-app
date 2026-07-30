export default function WhatsAppSupport() {
  return (
    <div className="container-fluid mt-4">
      <div className="card shadow">
        <div className="card-body text-center">
          <h2>WhatsApp Support</h2>
          <p>Contact us through WhatsApp.</p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="btn btn-success"
          >
            Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}