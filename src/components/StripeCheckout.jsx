import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51Q8Nqu08XU4ASt7szC2AurgM5FpuOmmlKGmnP2d5LIUsMqkRdSZtmSDhaHtYz2cnvS2KSJh4WnumExaZg2cjNMiz00ofqMug79"
);

const StripeCheckout = ({
  amount,
  bookingId,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        bookingId={bookingId} // Pass the booking ID here
        onPaymentSuccess={onPaymentSuccess}
        onPaymentFailure={onPaymentFailure}
      />
    </Elements>
  );
};

export default StripeCheckout;
