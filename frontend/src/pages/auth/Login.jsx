import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

export default function Login(){

const navigate = useNavigate();

const [form,setForm]=useState({
    email:"",
    password:""
});

const handleChange=(e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value
    });
};

const handleLogin=async(e)=>{

    e.preventDefault();

    try{

        const res=await API.post("/auth/login",form);

        localStorage.setItem("token",res.data.token);
      

        localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
        );

        toast.success("Login Successful");

        navigate("/dashboard");

    }catch(err){

        toast.error(
            err.response?.data?.message || "Login Failed"
        );

    }

};

return(

<div className="container-fluid vh-100">

<div className="row h-100">

<div className="col-lg-6 d-flex align-items-center justify-content-center">

<div className="card p-5 shadow" style={{width:"420px"}}>

<h2 className="fw-bold mb-2">

Welcome Back

</h2>

<p className="text-muted mb-4">

Login to your Amara Lands account

</p>

<form onSubmit={handleLogin}>

<div className="mb-3">

<label>Email</label>

<input
name="email"
value={form.email}
onChange={handleChange}
className="form-control"
placeholder="Enter Email"
/>

</div>

<div className="mb-4">

<label>Password</label>

<input
type="password"
name="password"
value={form.password}
onChange={handleChange}
className="form-control"
placeholder="Password"
/>

</div>

<button
type="submit"
className="btn btn-primary w-100"
>

Login

</button>

</form>

<div className="text-center mt-4">

Don't have an account?

<Link
to="/register"
className="ms-2"
>

Register

</Link>

</div>

</div>

</div>

<div className="col-lg-6 bg-primary text-white d-none d-lg-flex align-items-center justify-content-center">

<div>

<h1 className="display-4 fw-bold">

Amara Lands

</h1>

<p className="lead">

Smart Property Management Platform

</p>

</div>

</div>

</div>

</div>

);

}