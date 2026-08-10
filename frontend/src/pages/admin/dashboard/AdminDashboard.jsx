import { FaUsers, FaHome, FaMoneyBillWave, FaGavel, FaUserTie, FaClipboardCheck, FaBell, FaCalendarAlt } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

      <div className="row">

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaUsers size={35} className="text-primary mb-2" />
              <h3>120</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaHome size={35} className="text-success mb-2" />
              <h3>48</h3>
              <p>Total Properties</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaMoneyBillWave size={35} className="text-warning mb-2" />
              <h3>₹2,45,000</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaClipboardCheck size={35} className="text-danger mb-2" />
              <h3>15</h3>
              <p>Pending Verification</p>
            </div>
          </div>
        </div>

      </div>

      <div className="row">

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaGavel size={35} className="text-secondary mb-2" />
              <h3>8</h3>
              <p>Legal Cases</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaUserTie size={35} className="text-info mb-2" />
              <h3>12</h3>
              <p>Staff Members</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaCalendarAlt size={35} className="text-primary mb-2" />
              <h3>6</h3>
              <p>Today's Appointments</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <FaBell size={35} className="text-warning mb-2" />
              <h3>10</h3>
              <p>Notifications</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}