import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLegalCase, updateLegalCase } from "../../services/legalService";

export default function EditLegalCase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: "",
    case_title: "",
    case_number: "",
    court_name: "",
    advocate_name: "",
    hearing_date: "",
    status: "",
    remarks: "",
  });

  useEffect(() => {
    loadLegalCase();
  }, []);

  const loadLegalCase = async () => {
    try {
      const res = await getLegalCase(id);

      setFormData({
        property_id: res.legalCase.property_id || "",
        case_title: res.legalCase.case_title || "",
        case_number: res.legalCase.case_number || "",
        court_name: res.legalCase.court_name || "",
        advocate_name: res.legalCase.advocate_name || "",
        hearing_date: res.legalCase.hearing_date?.substring(0, 10) || "",
        status: res.legalCase.status || "",
        remarks: res.legalCase.remarks || "",
      });

    } catch (error) {
      console.log(error);
      alert("Failed to load legal case");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateLegalCase(id, formData);

      alert("Legal Case Updated Successfully");

      navigate("/legal");

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">Edit Legal Case</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-3"
          name="case_title"
          value={formData.case_title}
          onChange={handleChange}
          placeholder="Case Title"
        />

        <input
          className="form-control mb-3"
          name="case_number"
          value={formData.case_number}
          onChange={handleChange}
          placeholder="Case Number"
        />

        <input
          className="form-control mb-3"
          name="court_name"
          value={formData.court_name}
          onChange={handleChange}
          placeholder="Court Name"
        />

        <input
          className="form-control mb-3"
          name="advocate_name"
          value={formData.advocate_name}
          onChange={handleChange}
          placeholder="Advocate Name"
        />

        <input
          type="date"
          className="form-control mb-3"
          name="hearing_date"
          value={formData.hearing_date}
          onChange={handleChange}
        />

        <select
          className="form-select mb-3"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>

        <textarea
          className="form-control mb-3"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Remarks"
        />

        <button className="btn btn-primary">
          Update Legal Case
        </button>

      </form>

    </div>
  );
}