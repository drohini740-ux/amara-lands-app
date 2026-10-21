
export default function Footer() {
  return (
    <footer
      className="text-center mt-auto"
      style={{
        background: "#FFFFFF",
        borderTop: "2px solid #D4AF37",
        padding: "18px 12px",
        color: "#555555",
      }}
    >
      <p className="mb-1 fw-semibold" style={{ color: "#111111" }}>
        AMARA LANDS
      </p>

      <small>
        © {new Date().getFullYear()} Amara Lands. All Rights Reserved.
      </small>
    </footer>
  );
}
