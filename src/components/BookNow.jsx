import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { EventSeat } from "@mui/icons-material"; // Importing the seat icon
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
  const [passengerDetails, setPassengerDetails] = useState([]);

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

    // Adjust passenger details form based on number of seats selected
    const updatedPassengerDetails = [...passengerDetails];
    if (updatedSeats.has(seatNumber)) {
      // Add passenger detail form for the newly selected seat
      updatedPassengerDetails.push({
        seatNumber,
        passengerName: "",
        passengerAge: "",
        passengerGender: "",
      });
    } else {
      // Remove passenger detail form if seat is deselected
      const index = updatedPassengerDetails.findIndex(
        (detail) => detail.seatNumber === seatNumber
      );
      if (index !== -1) {
        updatedPassengerDetails.splice(index, 1);
      }
    }
    setPassengerDetails(updatedPassengerDetails);
  };

  const handlePassengerDetailChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index][field] = value;
    setPassengerDetails(updatedDetails);
  };

  const handleBooking = async () => {
    if (selectedSeats.size === 0) {
      setError("Please select at least one seat to book.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        setError("You must be logged in to book a seat.");
        setOpenSnackbar(true);
        return;
      }

      // Validate passenger details
      for (let detail of passengerDetails) {
        if (
          !detail.passengerName ||
          !detail.passengerAge ||
          !detail.passengerGender
        ) {
          setError("Please fill in all passenger details.");
          setOpenSnackbar(true);
          return;
        }
      }

      // Send seatDetails along with the passenger information
      const seatDetails = passengerDetails.map((detail) => ({
        seatNumber: detail.seatNumber,
        passengerName: detail.passengerName,
        passengerAge: detail.passengerAge,
        passengerGender: detail.passengerGender,
      }));

      await axios.post(
        "http://localhost:5000/api/buses/book",
        {
          busId,
          seatDetails,
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
  if (!bus) return <div>No bus found.</div>;

  // Extract bookedSeats from the bus response
  const bookedSeats = bus.bookedSeats.map((seat) => seat.seatNumber);

  // Define seat layout (number of rows and seats per row)
  const rows = Math.ceil(bus.seats / 4); // Example: 4 seats per row
  const seatsPerRow = 4;

  // Generate seat numbers based on the layout
  const seatNumbers = Array.from(
    { length: bus.seats },
    (_, index) => index + 1
  );

  return (
    <div>
      <CustomAppBar />
      <Container style={{ marginTop: "20px", paddingBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Booking for {bus.busName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Select Your Seats:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Grid
              container
              item
              xs={12}
              spacing={2}
              key={rowIndex}
              justifyContent="center"
            >
              {seatNumbers
                .slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow)
                .map((seatNumber) => {
                  const isBooked = bookedSeats.includes(seatNumber);
                  const isSelected = selectedSeats.has(seatNumber);
                  return (
                    <Grid item key={seatNumber}>
                      <Tooltip
                        title={
                          isBooked
                            ? "Seat already booked"
                            : isSelected
                            ? "Selected"
                            : "Available"
                        }
                        arrow
                        disableInteractive
                      >
                        <Button
                          onClick={() =>
                            !isBooked && handleSeatSelect(seatNumber)
                          }
                          variant="contained"
                          color={
                            isBooked
                              ? "default"
                              : isSelected
                              ? "primary"
                              : "success"
                          }
                          disabled={isBooked}
                          style={{
                            minWidth: "40px",
                            minHeight: "40px",
                            borderRadius: "50%",
                            margin: "5px",
                          }}
                        >
                          <EventSeat />
                        </Button>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        display="block"
                        align="center"
                      >
                        {seatNumber}
                      </Typography>
                    </Grid>
                  );
                })}
            </Grid>
          ))}
        </Grid>

        {/* Passenger Details Form */}
        {selectedSeats.size > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Passenger Details:
            </Typography>
            {passengerDetails.map((detail, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Seat {detail.seatNumber}:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Passenger Name"
                      variant="outlined"
                      fullWidth
                      value={detail.passengerName}
                      onChange={(e) =>
                        handlePassengerDetailChange(
                          index,
                          "passengerName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Passenger Age"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={detail.passengerAge}
                      onChange={(e) =>
                        handlePassengerDetailChange(
                          index,
                          "passengerAge",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      label="Passenger Gender"
                      variant="outlined"
                      fullWidth
                      value={detail.passengerGender}
                      onChange={(e) =>
                        handlePassengerDetailChange(
                          index,
                          "passengerGender",
                          e.target.value
                        )
                      }
                      required
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleBooking}
          sx={{ mt: 2 }}
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
