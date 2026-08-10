import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

export default function Consultation() {

    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        loadConsultations();
    }, []);

   const loadConsultations = async () => {
  try {
    const res = await api.get("/consultations");

    console.log("API Response:", res.data);

    setConsultations(res.data.consultations || []);
  } catch (err) {
    console.log("Error:", err);
  }
};
    const handleDelete = async(id)=>{

        if(!window.confirm("Delete Consultation?")) return;

        try{

            await api.delete(`/consultations/${id}`);
            alert("Deleted Successfully");

            loadConsultations();

        }catch(err){

            console.log(err);

        }

    }

    return (

<div className="container-fluid p-4">

<div className="d-flex justify-content-between mb-4">

<h2>Consultation Booking</h2>

<Link
className="btn btn-primary"
to="/consultations/add"
>
Book Consultation
</Link>

</div>

<div className="card shadow">

<div className="card-body">

<table className="table table-bordered">

<thead className="table-dark">

<tr>

<th>ID</th>
<th>Case</th>
<th>Date</th>
<th>Time</th>
<th>Meeting</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{consultations.map(item=>(

<tr key={item.id}>

<td>{item.id}</td>

<td>{item.case_title}</td>

<td>{item.consultation_date}</td>

<td>{item.consultation_time}</td>

<td>{item.meeting_type}</td>

<td>

<span className="badge bg-warning">

{item.status}

</span>

</td>

<td>

<Link
className="btn btn-info btn-sm me-2"
to={`/consultations/view/${item.id}`}
>
View
</Link>

<Link
className="btn btn-warning btn-sm me-2"
to={`/consultations/edit/${item.id}`}
>
Edit
</Link>

<button
className="btn btn-danger btn-sm"
onClick={()=>handleDelete(item.id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

    );

}