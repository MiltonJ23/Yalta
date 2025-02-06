import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Box, Typography } from "@mui/material";
import './ApplicantLogin.css';

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;
  const navigate = useNavigate();

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password };
      console.log("Sending request with body:", body); // Log the request body
      const response = await fetch(
        "http://localhost:3000/auth/applicant/login",
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
      console.log("I think you received the token in the console , if not the problem lies here");

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        console.log("I think you received the token in the console , if not the problem lies here 22");
        setAuth({ isAuthenticated: true, role: null }); // Update auth state
        console.log("I think the problem lied not here , even after changing the role ");
        toast.success("Logged in Successfully");
        setInputs({ email: "", password: "" }); // Clear the text fields
        console.log("Navigating to /applicant/dashboard");
        navigate("/dashboard/applicant"); // Redirect to dashboard
      } else {
        setAuth({ isAuthenticated: false, role: null });
        toast.error(parseRes.message || "Impossible de se connecter"); // Display the error message from the server
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
          <Link to="/" className="home-link">Login</Link>
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
        <Button
          type="submit"
          variant="contained"
          className="login-button"
        >
          Log In
        </Button>
        <Link to="/applicant/register" className="register-link">
          You don't have an account? Register
        </Link>
      </Box>
    </Fragment>
  );
};

export default Login;