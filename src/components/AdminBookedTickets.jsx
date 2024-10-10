import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomAppBar from "./CustomAppbar";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const AdminBookedTickets = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view booked tickets.");
      setOpenSnackbar(true);
      navigate("/login");
      return;
    }

    const fetchBookedTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/buses/${busId}/tickets`,
          {
            headers: { "x-auth-token": token },
          }
        );
        console.log(response.data);
        setBookedTickets(response.data);
      } catch (error) {
        setError("Error fetching booked tickets.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTickets();
  }, [busId, navigate]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div>
      <CustomAppBar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Booked Tickets for Bus {busId}
          </Typography>
          {bookedTickets.length === 0 ? (
            <Typography>No tickets booked yet.</Typography>
          ) : (
            <List>
              {bookedTickets.map((ticket, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Ticket #${index + 1}`}
                    secondary={
                      <div>
                        <strong>Name: </strong> {ticket.userName}
                        <br />
                        <strong>Email: </strong> {ticket.userEmail}
                        <br />
                        <strong>Seat Number: </strong> {ticket.seatNumber}
                        <br />
                        <div>
                          <strong>Passenger Details: </strong>
                          <ul style={{ marginTop: 0 }}>
                            <li>
                              <strong>Name: </strong>
                              {ticket.passengerName}
                            </li>
                            <li>
                              <strong>Age: </strong>
                              {ticket.passengerAge}
                            </li>
                            <li>
                              <strong>Gender: </strong>
                              {ticket.passengerGender}
                            </li>
                          </ul>
                        </div>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/booked-tickets"
            sx={{ mt: 2 }}
          >
            Back to Buses
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default AdminBookedTickets;
