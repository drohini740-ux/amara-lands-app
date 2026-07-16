import { Link } from "react-router-dom";

export default function Register(){

return(

<div className="container-fluid vh-100">

<div className="row h-100">

<div className="col-lg-6 d-flex align-items-center justify-content-center">

<div className="card p-5" style={{width:"500px"}}>

<h2 className="fw-bold mb-4">

Create Account

</h2>

<form>

<input
className="form-control mb-3"
placeholder="Full Name"
/>

<input
className="form-control mb-3"
placeholder="Mobile"
/>

<input
className="form-control mb-3"
placeholder="Email"
/>

<input
type="password"
className="form-control mb-3"
placeholder="Password"
/>

<input
type="password"
className="form-control mb-4"
placeholder="Confirm Password"
/>

<button
className="btn btn-success w-100"
>

Register

</button>

</form>

<div className="text-center mt-4">

Already have an account?

<Link
to="/login"
className="ms-2"
>

Login

</Link>

</div>

</div>

</div>

<div className="col-lg-6 bg-success text-white d-none d-lg-flex align-items-center justify-content-center">

<div>

<h1 className="display-5">

Amara Lands

</h1>

<p>

Secure Land Management Solution

</p>

</div>

</div>

</div>

</div>

);

}