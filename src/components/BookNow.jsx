import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CustomAppBar from "./CustomAppbar";

const BookNow = () => {
  const { busId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      const fetchBusDetails = async () => {
        try {
          const busResponse = await axios.get(
            `http://localhost:5000/api/buses/${busId}`
          );
          setBus(busResponse.data);
          setLoading(false);
        } catch (err) {
          setError("Error fetching bus details. Please try again.");
          setOpenSnackbar(true);
          setLoading(false);
        }
      };
      fetchBusDetails();
    }
  }, [user, navigate, busId]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSeatSelect = (seatNumber) => {
    const updatedSeats = new Set(selectedSeats);
    if (updatedSeats.has(seatNumber)) {
      updatedSeats.delete(seatNumber); // Deselect seat if already selected
    } else {
      updatedSeats.add(seatNumber); // Select seat
    }
    setSelectedSeats(updatedSeats);
  };

  const handleBooking = async () => {
    if (selectedSeats.size === 0) {
      setError("Please select at least one seat to book.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const seatNumbers = Array.from(selectedSeats); // Convert Set to Array
      console.log("Selected Seats:", seatNumbers); // Debugging line

      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        setError("You must be logged in to book a seat.");
        setOpenSnackbar(true);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/buses/book",
        {
          busId,
          seatNumbers,
        },
        {
          headers: { "x-auth-token": token }, // Include token in the headers
        }
      );

      alert("Booking successful!");
      navigate("/"); // Redirect to homepage after booking
    } catch (err) {
      setError(
        err.response?.data?.msg || "Error booking the bus. Please try again."
      );
      setOpenSnackbar(true);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;
  if (!bus) return <div>No bus found.</div>;

  // Extract bookedSeats from the bus response
  const bookedSeats = bus.bookedSeats.map((seat) => seat.seatNumber);

  return (
    <div>
      <CustomAppBar />
      <Container style={{ marginTop: "20px", paddingBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Booking for {bus.name}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Select Your Seats:
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: bus.seats }, (_, index) => {
            const seatNumber = index + 1;
            const isBooked = bookedSeats.includes(seatNumber);

            return (
              <Grid item xs={2} key={seatNumber}>
                <Tooltip
                  title={isBooked ? "Seat already booked" : "Available seat"}
                  arrow
                  disableInteractive
                >
                  <Card
                    onClick={() => !isBooked && handleSeatSelect(seatNumber)}
                    style={{
                      padding: "20px",
                      cursor: isBooked ? "not-allowed" : "pointer",
                      backgroundColor: selectedSeats.has(seatNumber)
                        ? "#3f51b5"
                        : isBooked
                        ? "#e0e0e0"
                        : "#fff",
                      color: selectedSeats.has(seatNumber) ? "#fff" : "#000",
                      border: isBooked ? "1px solid #ccc" : "1px solid #000",
                      textAlign: "center",
                      opacity: isBooked ? 0.6 : 1,
                    }}
                  >
                    Seat {seatNumber}
                  </Card>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBooking}
          style={{ marginTop: "20px" }}
          disabled={selectedSeats.size === 0}
        >
          Confirm Booking
        </Button>
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
      </Container>
    </div>
  );
};

export default BookNow;
