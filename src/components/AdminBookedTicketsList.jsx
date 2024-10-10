import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import CustomAppBar from "./CustomAppbar";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminBookedTicketsList = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/buses/");
        setBuses(response.data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div>
      <CustomAppBar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Booked Tickets - Buses
          </Typography>
          <List>
            {buses.map((bus) => (
              <Box key={bus.busNumber} mb={2}>
                <Card elevation={3}>
                  <CardContent>
                    <ListItem
                      button
                      component={Link}
                      to={`/admin/booked-tickets/${bus.busNumber}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <ListItemText
                        primary={`Bus Name: ${bus.busName}`}
                        secondary={`Bus Number: ${bus.busNumber}`}
                      />
                    </ListItem>
                  </CardContent>
                  <Divider />
                </Card>
              </Box>
            ))}
          </List>
        </Box>
      </Container>
    </div>
  );
};

export default AdminBookedTicketsList;
