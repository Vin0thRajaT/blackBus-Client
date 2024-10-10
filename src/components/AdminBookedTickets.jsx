import React, { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false); // For the reset confirmation dialog
  const ticketListRef = useRef(null); // Reference for the ticket list (for printing)

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
        setBookedTickets(response.data);
      } catch (error) {
        setError("Error fetching booked tickets.");
        setSnackbarSeverity("error");
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

  const handlePrint = () => {
    window.print(); // Simple way to print the page
  };

  const handleResetBus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to reset the bus.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/buses/reset`,
        { busNumber: busId }, // Send the bus ID or number in the request
        {
          headers: { "x-auth-token": token },
        }
      );

      setSnackbarMessage(response.data.msg || "Bus reset successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Refresh the booked tickets after resetting the bus
      setBookedTickets([]);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.msg || "Error resetting the bus."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the confirmation dialog
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
            <div ref={ticketListRef}>
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
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            sx={{ mt: 2, mr: 2 }}
          >
            Print Ticket List
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenDialog} // Open dialog before resetting
            sx={{ mt: 2 }}
          >
            Reset Bus
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/booked-tickets"
            sx={{ mt: 2, ml: 2 }}
          >
            Back to Buses
          </Button>
        </Box>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Reset Bus?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Warning: Resetting the bus will remove all booked seats and make all
            seats available again. This action is irreversible. Are you sure you
            want to reset the bus {busId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetBus} color="secondary" autoFocus>
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminBookedTickets;
