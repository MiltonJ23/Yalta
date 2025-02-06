import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Box, Typography } from "@mui/material";
import './ApplicantLogin.css'; // Utilisez le même fichier CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const { email, password, name } = inputs;
  const navigate = useNavigate();

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, name };
      console.log("Sending request with body:", body); // Log the request body
      const response = await fetch(
  "http://localhost:3000/auth/applicant/register",
  {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(body)
  }
);
const parseRes = await response.json();
console.log("Response from server:", parseRes); // Log the server response

if (parseRes.token) {
  localStorage.setItem("token", parseRes.token);
  setAuth({ isAuthenticated: true, role: 'applicant' }); // Update auth state
  toast.success("Registered Successfully");
  setInputs({ email: "", password: "", name: "" }); // Clear the text fields
  navigate("/applicant/login"); // Redirect to login page
} else {
  setAuth({ isAuthenticated: false, role: null });
  toast.error("User already exists "); // Display the error message from the server
}

} catch (err) {
  console.error(err.message);
  toast.error("An error occurred during registration."); // Display a user-friendly error message
  setInputs({ email: "", password: "", name: "" }); // Clear the text fields
  navigate("/applicant/login"); // Redirect to login page
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
          <Link to="/" className="home-link">Register</Link>
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
          className="login-input"
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
        <Button
          type="submit"
          variant="contained"
          className="login-button"
        >
          Register
        </Button>
        <Link to="/applicant/login" className="register-link">
          Already have an account? Login
        </Link>
      </Box>
    </Fragment>
  );
};

export default Register;