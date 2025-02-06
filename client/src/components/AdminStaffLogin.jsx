import React, { Fragment, useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "./AdminStaffLogin.css"; // Ensure this path is correct

const AdminStaffLogin = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    StaffPass: "",
  });

  const { email, password, StaffPass } = inputs;
  const navigate = useNavigate();

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password, StaffPass };
      const response = await fetch(
        "http://localhost:3000/auth/adminStaff/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();
      console.log("Response from server:", parseRes)
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth({ isAuthenticated: true, role: 'admin' }); // Ensure role is set to 'admin'
        toast.success("Logged in Successfully");
        setInputs({ email: "", password: "", StaffPass: "" }); // Clear the text fields
        console.log("Navigating to /dashboard/admin");
        navigate("/dashboard/admin"); // Redirect to admin dashboard
      } else {
        setAuth({ isAuthenticated: false, role: '' });
        toast.error(parseRes); // Display the error message from the server
      }
    } catch (err) {
      console.error(err.message);
      toast.error("An error occurred during login."); // Display a user-friendly error message
    }
  };

  return (
    <Fragment>
      <Box
        component="form"
        onSubmit={onSubmitForm}
        className="login-form"
      >
        <Typography variant="h4" component="h1" gutterBottom className="login-label">
          <Link to="/" className="home-link">Admin Staff Login</Link>
        </Typography>
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input"
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
          className="login-input"
        />
        <TextField
          label="Staff Pass"
          name="StaffPass"
          type="password"
          value={StaffPass}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          fullWidth
          required
          className="login-input"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="login-button"
        >
          Log in
        </Button>
        <Typography variant="body2" align="center" className="register-link">
          No, already have an account? <Link to="/admin/register">Register</Link>
        </Typography>
      </Box>
    </Fragment>
  );
};

export default AdminStaffLogin;