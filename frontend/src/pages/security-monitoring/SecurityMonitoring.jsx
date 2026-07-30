import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaWalking,
  FaClipboardList,
    FaVideo, 
} from "react-icons/fa";


export default function SecurityMonitoring() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Security Reports",
      description: "Manage all security reports.",
      icon: <FaShieldAlt size={40} className="text-warning" />,
      path: "/security-reports",
    },
    {
      title: "Field Visits",
      description: "Manage field visit records.",
      icon: <FaWalking size={40} className="text-primary" />,
      path: "/field-visits",
    },
    {
      title: "Geo-tagged Reports",
      description: "Manage geo-tagged reports.",
      icon: <FaMapMarkerAlt size={40} className="text-success" />,
      path: "/geo-tagged-reports",
    },
    {
      title: "Patrol Logs",
      description: "Manage patrol logs.",
      icon: <FaClipboardList size={40} className="text-danger" />,
      path: "/patrol-logs",
    },
     {
    title: "Surveillance Cameras",
    description: "Manage surveillance cameras.",
    icon: <FaVideo size={40} className="text-info" />,
    path: "/surveillance-cameras",
  },

  ];

  return (
    <div className="container-fluid">

      <h2 className="fw-bold mb-4">
        Security Monitoring
      </h2>

      <div className="row">

        {modules.map((item) => (

          <div className="col-md-6 col-lg-3 mb-4" key={item.title}>

            <div className="card shadow h-100 text-center">

              <div className="card-body">

                {item.icon}

                <h5 className="mt-3">{item.title}</h5>

                <p className="text-muted">
                  {item.description}
                </p>

                <button
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

    </div>
  );
}