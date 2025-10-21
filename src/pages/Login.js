import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
function Landing(){return(
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{padding:24,border:"1px solid #eee",borderRadius:12}}>
      <h1>Welcome to PSSPOC</h1>
      <p><Link to="/login/existing">Existing User Login</Link></p>
      <p><Link to="/login/adduser">Add New User</Link></p>
    </div>
  </div>
);}
function Existing(){const[U,setU]=useState("");const[P,setP]=useState("");const[E,setE]=useState("");const n=useNavigate();
  const go=e=>{e.preventDefault(); if(U==="admin"&&P==="TCS@123"){localStorage.setItem("loggedIn","true"); n("/reports");} else setE("Invalid username or password");};
  return(<form onSubmit={go} style={{padding:24,maxWidth:360,margin:"80px auto",border:"1px solid #eee",borderRadius:12}}>
    <h2>Existing User Login</h2>
    <input placeholder="Username" value={U} onChange={e=>setU(e.target.value)} /><br/>
    <input type="password" placeholder="Password" value={P} onChange={e=>setP(e.target.value)} /><br/>
    {E && <div style={{color:"red"}}>{E}</div>}
    <button type="submit">Login</button> <Link to="/login">Back</Link>
  </form>);}
function AddUser(){return(<div style={{padding:24,maxWidth:360,margin:"80px auto"}}>Add User (stub) — Back to <Link to="/login">Login</Link></div>);}
export default function Login(){return(
  <Routes>
    <Route path="/" element={<Landing/>} />
    <Route path="/existing" element={<Existing/>} />
    <Route path="/adduser" element={<AddUser/>} />
  </Routes>
);}
