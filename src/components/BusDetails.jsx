import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import CustomAppBar from "./CustomAppbar";

const BusDetails = () => {
  const { busId } = useParams(); // Get the bus ID from the URL
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/buses/${busId}`
        );
        setBus(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching bus details. Please try again.");
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;
  if (!bus) return <div>No bus found.</div>;

  return (
    <div>
      <CustomAppBar />
      <Container style={{ marginTop: "20px", paddingBottom: "20px" }}>
        <Card elevation={3}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h4" gutterBottom>
                  {bus.busName}
                </Typography>
                <Typography variant="h6" style={{ color: "#6D6D6D" }}>
                  {bus.scheduleTime} | {bus.duration}
                </Typography>
                <Typography variant="body1" style={{ color: "#6D6D6D" }}>
                  {bus.busType}
                </Typography>
                <Typography variant="body1">
                  <strong>Starts from</strong> INR {bus.price}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: "right" }}>
                <Box
                  sx={{
                    backgroundColor: "#E0E0E0",
                    borderRadius: "4px",
                    height: "20px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#4CAF50",
                      width: `${(bus.rating / 5) * 100}%`, // Assuming the rating is out of 5
                      height: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {bus.rating}
                  </Typography>
                </Box>
                <Typography variant="body1" style={{ color: "#6D6D6D" }}>
                  {bus.availableSeats} Seats available
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                >
                  <Link
                    to={`/buses/${bus.busNumber}/book`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    View Seats
                  </Link>
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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

export default BusDetails;
