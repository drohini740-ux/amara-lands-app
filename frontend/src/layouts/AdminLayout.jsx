import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* ================= ADMIN SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div
        className="flex-grow-1"
        style={{
          minWidth: 0,
        }}
      >
        {/* ================= ADMIN NAVBAR ================= */}
        <AdminNavbar />

        {/* ================= PAGE CONTENT ================= */}
        <main
          className="p-4"
          style={{
            minHeight: "calc(100vh - 70px)",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}