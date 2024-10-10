import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const CheckoutForm = ({
  amount,
  bookingId,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // To manage error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to book a seat.");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      // Define the return URL for redirection after payment
      const returnUrl = `${window.location.origin}/payment-success`; // Change this to your desired success URL
      console.log(paymentMethod.id, amount, bookingId, returnUrl);

      // Make API call to your server to create a payment intent
      const { data } = await axios.post(
        "http://localhost:5000/api/buses/create-payment-intent",
        {
          paymentMethodId: paymentMethod.id,
          amount,
          bookingId, // Include booking ID
          returnUrl, // Include return URL
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      const { clientSecret } = data;

      // Confirm the payment with the client secret
      const { error: confirmationError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);

      if (confirmationError) {
        setError(confirmationError.message);
        setOpenSnackbar(true);
        onPaymentFailure();
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(true);
      } else {
        onPaymentFailure();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
      setOpenSnackbar(true);
      onPaymentFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!stripe || loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Pay Now"}
        </Button>
      </form>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CheckoutForm;
