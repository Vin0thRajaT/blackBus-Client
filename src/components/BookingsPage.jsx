import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CustomAppBar from "./CustomAppbar";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  bookingCard: {
    margin: theme.spacing(2),
    backgroundColor: "#f5f5f5", // light background for cards
  },
  snackbar: {
    margin: theme.spacing(2),
  },
}));

const BookingsPage = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the selected booking ID for cancellation

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/buses/user/bookings",
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        console.log(response.data)
        setBookings(response.data);
      } catch (err) {
        setError("Error fetching bookings. Please try again later.");
        setOpenSnackbar(true);
        console.error("Error fetching bookings:", err);
      }
    };

    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setOpenDialog(true); // Open the dialog to confirm cancellation
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBookingId(null);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/buses/cancel",
        { bookingId: selectedBookingId },
        {
          headers: { "x-auth-token": token },
        }
      );
      // Remove the canceled booking from the state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== selectedBookingId)
      );
      setOpenDialog(false);
      alert("Booking canceled successfully!");
    } catch (err) {
      setError("Error canceling booking. Please try again later.");
      setOpenSnackbar(true);
      console.error("Error canceling booking:", err);
    }
  };

  return (
    <div className={classes.root}>
      <CustomAppBar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ marginTop: "20px" }}>
          Your Bookings
        </Typography>
        {bookings.length === 0 ? (
          <Typography variant="h6">You have no bookings.</Typography>
        ) : (
          <Grid container spacing={2}>
            {bookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking._id}>
                <Card className={classes.bookingCard}>
                  <CardContent>
                    <Typography variant="h6">
                      Bus Number: {booking.bus.busName}
                    </Typography>
                    <Typography variant="body1">
                      Route: {booking.bus.route}
                    </Typography>
                    <Typography variant="body1">
                      Seat Numbers: {booking.seatNumbers.join(", ")}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleCancelClick(booking._id)}
                      style={{ marginTop: "10px" }}
                    >
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        className={classes.snackbar}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
