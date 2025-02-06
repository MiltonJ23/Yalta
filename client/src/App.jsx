// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./components/HomePage";
import ApplicantLogin from "./components/ApplicantLogin";
import ApplicantRegister from "./components/ApplicantRegister";
import ApplicantDashboard from "./components/ApplicantDashboard";
import AdminStaffLogin from "./components/AdminStaffLogin";
import AdminStaffRegister from "./components/AdminStaffRegister";
import AdminStaffDashboard from "./components/AdminStaffDashboard";
import "./App.css";

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null // 'applicant' ou 'admin'
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<ApplicantLogin setAuth={setAuth} />} />
        <Route path="/dashboard/applicant" element={auth.isAuthenticated ? <ApplicantDashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
        
        {/* Routes Applicant */}
        <Route path="/applicant/login" element={
          !auth.isAuthenticated ? 
            <ApplicantLogin setAuth={setAuth} /> : 
            <Navigate to="/applicant/dashboard" />
        }/>
        <Route path="/applicant/register" element={
          !auth.isAuthenticated ? 
            <ApplicantRegister setAuth={setAuth} /> : 
            <Navigate to="/applicant/dashboard" />
        }/>
        <Route path="/applicant/dashboard" element={
          auth.isAuthenticated && auth.role === 'applicant' ? 
            <ApplicantDashboard setAuth={setAuth} /> : 
            <Navigate to="/applicant/login" />
        }/>

        {/* Routes Admin */}
        <Route path="/admin/login" element={
          !auth.isAuthenticated ? 
            <AdminStaffLogin setAuth={setAuth} /> : 
            <Navigate to="/dashboard/admin" />
        }/>
        <Route path="/admin/register" element={
          !auth.isAuthenticated ? 
            <AdminStaffRegister setAuth={setAuth} /> : 
            <Navigate to="/dashboard/admin" />
        }/>
        <Route path="/dashboard/admin" element={
          auth.isAuthenticated && auth.role === 'admin' ? 
            <AdminStaffDashboard setAuth={setAuth} /> : 
            <Navigate to="/admin/login" />
        }/>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;