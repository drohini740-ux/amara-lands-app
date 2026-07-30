import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaQuestionCircle,
  FaWhatsapp,
  FaComments,
} from "react-icons/fa";

export default function CustomerSupport() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Support Tickets",
      icon: <FaTicketAlt size={40} />,
      path: "/tickets",
    },
    {
      title: "FAQs",
      icon: <FaQuestionCircle size={40} />,
      path: "/faq",
    },
    {
      title: "WhatsApp Support",
      icon: <FaWhatsapp size={40} />,
      path: "/whatsapp",
    },
    {
      title: "Live Chat",
      icon: <FaComments size={40} />,
      path: "/live-chat",
    },
  ];

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Customer Support</h2>

      <div className="row">
        {modules.map((item) => (
          <div className="col-md-3 mb-4" key={item.title}>
            <div className="card shadow h-100 text-center">
              <div className="card-body">
                {item.icon}
                <h5 className="mt-3">{item.title}</h5>

                <button
                  className="btn btn-warning mt-3"
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