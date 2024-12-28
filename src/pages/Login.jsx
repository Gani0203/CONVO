import React from "react";
import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err,setErr]= useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      setErr(true);
      console.error("Error:", err.message);
    }
  };
  
  return (
    <div className="fc">
      <div className="fw">
        <span className="logo">CONVO</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign in</button>
          {err && <span>Something went wrong..</span>}
        </form>
        <p>New user? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
