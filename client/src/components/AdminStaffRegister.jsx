import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Box, Typography } from "@mui/material";
import './AdminStaffRegister.css'; // Import the new CSS file
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminStaffRegister = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    StaffPass: "" // Ensure consistent naming
  });

  const { email, password, name, StaffPass } = inputs;
  const navigate = useNavigate();

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { name ,email , password , StaffPass };
      console.log("Sending request with body:", body); 
      const response = await fetch(
        "http://localhost:3000/auth/adminStaff/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();
      console.log("Response from server:", parseRes);

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Admin Staff Registered Successfully");
        setInputs({ email: "", password: "", name: "", StaffPass: "" }); // Clear inputs after successful registration
        navigate("/admin/login"); // Redirect to admin dashboard
        
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("An error occurred during registration."); // Display a user-friendly error message
    }
  };

  return (
    <Fragment>
      <Box
        component="form"
        onSubmit={onSubmitForm}
        className="login-form" // Apply the same class as in AdminStaffLogin
      >
        <Typography variant="h4" component="h1" gutterBottom className="login-label">
          <Link to="/" className="home-link">Admin Staff Registration</Link>
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input" // Apply the same class as in AdminStaffLogin
        />
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input" // Apply the same class as in AdminStaffLogin
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input" // Apply the same class as in AdminStaffLogin
          autoComplete="new-password"
        />
        <TextField
          label="StaffPass"
          name="StaffPass"
          type="password"
          value={StaffPass} // Ensure consistent naming
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input" // Apply the same class as in AdminStaffLogin
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="login-button" // Apply the same class as in AdminStaffLogin
        >
          Register
        </Button>
        <Typography variant="body2" className="login-footer">
          Already have an account? <Link to="/admin/login" className="login-link">Login</Link>
        </Typography>
      </Box>
    </Fragment>
  );
};

export default AdminStaffRegister;