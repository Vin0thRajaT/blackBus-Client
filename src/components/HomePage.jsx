import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomAppBar from "./CustomAppbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8f8f8",
    color: "#000",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(4),
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(4, 0),
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: theme.spacing(2),
  },
  offerCard: {
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  button: {
    marginLeft: theme.spacing(2),
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchAllBuses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/buses");
        setBuses(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No buses found.");
        } else {
          setError("Error fetching buses. Please try again later.");
        }
        setOpenSnackbar(true);
        console.error("Error fetching buses:", error);
      }
    };

    fetchAllBuses();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/buses/search",
        {
          params: { fromCity, toCity, date },
        }
      );
      setBuses(response.data);
      if (response.data.length === 0) {
        setError("No buses found for the selected route and date.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No buses found.");
      } else {
        setError("Error fetching buses. Please try again later.");
      }
      setOpenSnackbar(true);
      console.error("Error fetching buses:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={classes.root}>
      <CustomAppBar />

      <Container>
        <div className={classes.searchContainer}>
          <TextField
            label="From"
            variant="outlined"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            sx={{ marginRight: 1, flex: 1 }}
          />
          <TextField
            label="To"
            variant="outlined"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            sx={{ marginRight: 1, flex: 1 }}
          />
          <TextField
            type="date"
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ marginRight: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            className={classes.button}
          >
            Search
          </Button>
        </div>

        {buses.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Available Buses
            </Typography>
            <Grid container spacing={2}>
              {buses.map((bus) => (
                <Grid item xs={12} sm={6} md={4} key={bus._id}>
                  <Link to={`/buses/${bus.busNumber}`} key={bus.busNumber}>
                    <Card className={classes.offerCard}>
                      <CardContent>
                        <Typography variant="h6">{bus.busName}</Typography>
                        <Typography variant="textSecondary">
                          {bus.fromCity} to {bus.toCity}
                        </Typography>
                        <Typography color="textSecondary">
                          Departure: {bus.scheduleDate} <br />
                          Time: {bus.scheduleTime}
                        </Typography>
                        <Typography variant="textSecondary">
                          A/C Sleeper (2+1)
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message={error}
          autoHideDuration={6000}
        />
      </Container>
    </div>
  );
};

export default HomePage;
