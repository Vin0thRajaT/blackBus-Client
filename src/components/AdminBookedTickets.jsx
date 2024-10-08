import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import CustomAppBar from "./CustomAppbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const AdminBookedTickets = () => {
  const { busId } = useParams();
  const [bookedTickets, setBookedTickets] = useState([]);
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You must be logged in to book a seat.");
    setOpenSnackbar(true);
    return;
  }

  useEffect(() => {
    const fetchBookedTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/buses/${busId}/tickets`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        console.log(response.data);
        setBookedTickets(response.data);
      } catch (error) {
        console.error("Error fetching booked tickets:", error);
      }
    };
    fetchBookedTickets();
  }, [busId]);

  return (
    <div>
      <CustomAppBar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Booked Tickets
          </Typography>
          <List>
            {bookedTickets.map((ticket, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${ticket.name} (${ticket.email})`}
                  secondary={`Seats: ${ticket.seatNumbers}`}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/booked-tickets"
          >
            Back to Buses
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default AdminBookedTickets;
