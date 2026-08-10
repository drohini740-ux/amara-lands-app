import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1">

        <AdminNavbar />

        <div className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}