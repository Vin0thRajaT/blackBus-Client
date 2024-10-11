import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import CustomAppBar from "./CustomAppbar";

const AdminRegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState("admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open/close

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setSuccess(""); // Clear previous success message

    if (!validateForm()) return; // Validate form before submitting

    const adminData = { name, email, password, role };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        adminData
      );
      console.log("Admin registered successfully:", response.data);
      setSuccess("Admin registered successfully!"); // Set success message
      setSnackbarOpen(true); // Open Snackbar

      // Reset form fields after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("Error registering admin: " + error.message);
      setSnackbarOpen(true); // Open Snackbar for error message
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Register Admin
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Register Admin
            </Button>
          </form>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error || success} // Show either error or success message
        />
      </Container>
    </>
  );
};

export default AdminRegisterPage;
