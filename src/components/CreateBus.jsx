import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CustomAppBar from "./CustomAppbar";
import axios from "axios";

const CreateBus = () => {
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [fromCity, setFromCity] = useState(""); // Added fromCity state
  const [toCity, setToCity] = useState(""); // Added toCity state
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [seats, setSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [busType, setBusType] = useState("");
  const [amenities, setAmenities] = useState("");
  const [rating, setRating] = useState(0);
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      setError("You must be logged in to book a seat.");
      setOpenSnackbar(true);
      return;
    }
    const busData = {
      busName,
      busNumber,
      route,
      fromCity, // Include fromCity in the data sent to the server
      toCity, // Include toCity in the data sent to the server
      scheduleDate,
      scheduleTime,
      seats,
      price,
      busType,
      amenities,
      rating,
      duration,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/buses/create",
        busData,
        {
          headers: {
            "Content-Type": "application/json",
            // Include token if needed for authentication
            "x-auth-token": token,
          },
        }
      );

      const newBus = response.data;
      console.log("Bus created successfully:", newBus);

      // Reset form fields after successful creation
      setBusName("");
      setBusNumber("");
      setRoute("");
      setFromCity(""); // Reset fromCity
      setToCity(""); // Reset toCity
      setScheduleDate("");
      setScheduleTime("");
      setSeats(0);
      setPrice(0);
      setBusType("");
      setAmenities("");
      setRating(0);
      setDuration("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <CustomAppBar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Create Bus
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Bus Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              required
            />
            <TextField
              label="Bus Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              required
            />
            <TextField
              label="Route"
              variant="outlined"
              fullWidth
              margin="normal"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              required
            />
            <TextField
              label="From City" // New field for from city
              variant="outlined"
              fullWidth
              margin="normal"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            />
            <TextField
              label="To City" // New field for to city
              variant="outlined"
              fullWidth
              margin="normal"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              required
            />
            <TextField
              label="Schedule Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
            />
            <TextField
              label="Schedule Time"
              variant="outlined"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              required
            />
            <TextField
              label="Total Seats"
              variant="outlined"
              type="number"
              fullWidth
              margin="normal"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              required
            />
            <TextField
              label="Price (INR)"
              variant="outlined"
              type="number"
              fullWidth
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Bus Type</InputLabel>
              <Select
                value={busType}
                onChange={(e) => setBusType(e.target.value)}
                label="Bus Type"
              >
                <MenuItem value="Sleeper">Sleeper</MenuItem>
                <MenuItem value="Semi-Sleeper">Semi-Sleeper</MenuItem>
                <MenuItem value="Seater">Seater</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <TextField
              label="Amenities"
              variant="outlined"
              fullWidth
              margin="normal"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="e.g., AC, WiFi, Charging Port"
            />
            <TextField
              label="Rating (0-5)"
              variant="outlined"
              type="number"
              fullWidth
              margin="normal"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              inputProps={{ min: 0, max: 5 }}
            />
            <TextField
              label="Duration"
              variant="outlined"
              fullWidth
              margin="normal"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 8h 30m"
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Create Bus
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default CreateBus;
