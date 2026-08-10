import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">

      <div>
        <h4 className="mb-0 fw-bold">
          Admin Dashboard
        </h4>
      </div>

      <div className="d-flex align-items-center">

        <button
          className="btn btn-light position-relative me-3"
          title="Notifications"
        >
          <FaBell size={18} />

          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            3
          </span>
        </button>

        <div className="dropdown">

          <button
            className="btn btn-light dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <FaUserCircle className="me-2" size={20} />

            {user?.full_name || "Admin"}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">

            <li>
              <span className="dropdown-item-text">
                {user?.email}
              </span>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={logout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </li>

          </ul>

        </div>

      </div>

    </nav>
  );
}