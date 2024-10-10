import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Box, Alert, Button } from "@mui/material";
import axios from "axios";

const PaymentStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const success = queryParams.get("success");
  const bookingId = queryParams.get("bookingId");
  const cancel = queryParams.get("cancel");

  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const confirmBooking = async (tempBookingId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/buses/confirm-booking",
        { tempBookingId },
        {
          headers: { "x-auth-token": token },
        }
      );
      console.log(res);
    } catch (err) {
      setError("Error confirming booking.");
      setOpenSnackbar(true);
    }
  };

  const cancelBooking = async (tempBookingId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/buses/cancel-booking/${tempBookingId}`,
        {},

        {
          headers: { "x-auth-token": token },
        }
      );
    } catch (err) {
      setError("Error cancelling booking.");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const tempBookingId = localStorage.getItem("tempBookingId");
    console.log(tempBookingId);

    if (success === "true" && tempBookingId) {
      confirmBooking(tempBookingId);
    } else if (cancel === "true" && tempBookingId) {
      cancelBooking(tempBookingId);
    }
  }, [success, cancel]);

  return (
    <Container style={{ marginTop: "20px", paddingBottom: "20px" }}>
      {success === "true" && bookingId ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="h6">
            Your booking ID is: <strong>{bookingId}</strong>
          </Typography>
          <Alert severity="success" sx={{ mt: 2 }}>
            Thank you for your booking. You will receive a confirmation email
            shortly.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/")} // Redirect to home or another page
          >
            Go to Home
          </Button>
        </Box>
      ) : cancel === "true" ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Payment Canceled
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Your booking was not successful. Please try again.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/")} // Redirect to home or another page
          >
            Go to Home
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Unknown Payment Status
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            There was an issue with the payment process. Please contact support.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/")} // Redirect to home or another page
          >
            Go to Home
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default PaymentStatus;
