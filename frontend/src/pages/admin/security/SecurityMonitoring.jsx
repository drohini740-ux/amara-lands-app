import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaWalking,
  FaClipboardList,
  FaVideo,
  FaExclamationTriangle,
  FaCamera,
  FaBell,
  FaRobot,
  FaPlane,
} from "react-icons/fa";

export default function SecurityMonitoring() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Security Reports",
      description: "View and manage security reports.",
      icon: <FaShieldAlt size={40} className="text-warning" />,
      path: "/admin/security/reports",
    },

    {
      title: "Field Visits",
      description: "Monitor field visit activities.",
      icon: <FaWalking size={40} className="text-primary" />,
      path: "/admin/security/field-visits",
    },

    {
      title: "Geo-tagged Reports",
      description: "Monitor location-based security reports.",
      icon: <FaMapMarkerAlt size={40} className="text-success" />,
      path: "/admin/security/geo-reports",
    },

    {
      title: "Patrol Logs",
      description: "Review security patrol activities.",
      icon: <FaClipboardList size={40} className="text-danger" />,
      path: "/admin/security/patrol-logs",
    },

    {
      title: "Surveillance Cameras",
      description: "Monitor and manage CCTV cameras.",
      icon: <FaVideo size={40} className="text-info" />,
      path: "/admin/security/cameras",
    },

    {
      title: "Motion Detection Alerts",
      description: "Monitor detected motion and security alerts.",
      icon: (
        <FaExclamationTriangle
          size={40}
          className="text-danger"
        />
      ),
      path: "/admin/security/motion-alerts",
    },

    {
      title: "Live Camera Feed",
      description: "View live surveillance camera feeds.",
      icon: <FaCamera size={40} className="text-primary" />,
      path: "/admin/security/live-feed",
    },

    {
      title: "Intrusion Notifications",
      description: "Monitor intrusion and security notifications.",
      icon: <FaBell size={40} className="text-warning" />,
      path: "/admin/security/intrusion-notifications",
    },
  ];

  return (
    <div
      className="container-fluid p-4"
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4">
        <h2 className="fw-bold">
          <FaShieldAlt className="me-2 text-warning" />
          Security Monitoring
        </h2>

        <p className="text-muted">
          Monitor property security, surveillance cameras,
          alerts and field activities from the admin panel.
        </p>
      </div>

      {/* =====================================================
          FEATURE CARDS
      ===================================================== */}

      <div className="row">
        {modules.map((item) => (
          <div
            className="col-md-6 col-lg-3 mb-4"
            key={item.title}
          >
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center d-flex flex-column">

                <div className="mb-2">
                  {item.icon}
                </div>

                <h5 className="fw-bold mt-2">
                  {item.title}
                </h5>

                <p className="text-muted small flex-grow-1">
                  {item.description}
                </p>

                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => navigate(item.path)}
                >
                  Open
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          FUTURE SCOPE
      ===================================================== */}

      <div className="card shadow-sm border-0 mt-3">

        <div
          className="card-header"
          style={{
            background: "#111",
            color: "#fff",
          }}
        >
          <h5 className="mb-0">
            Future Security Monitoring
          </h5>
        </div>

        <div className="card-body">
          <div className="row">

            {/* AI ACTIVITY DETECTION */}

            <div className="col-md-6 mb-3">
              <div className="border rounded p-3 h-100">

                <FaRobot
                  size={30}
                  className="text-primary me-2"
                />

                <strong>
                  AI Activity Detection
                </strong>

                <p className="text-muted small mt-2 mb-0">
                  AI-based detection of suspicious activities,
                  unusual movements and security threats.
                </p>

              </div>
            </div>

            {/* DRONE MONITORING */}

            <div className="col-md-6 mb-3">
              <div className="border rounded p-3 h-100">

                <FaPlane
                  size={30}
                  className="text-success me-2"
                />

                <strong>
                  Drone Monitoring
                </strong>

                <p className="text-muted small mt-2 mb-0">
                  Future integration for drone-based property
                  surveillance and perimeter monitoring.
                </p>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}