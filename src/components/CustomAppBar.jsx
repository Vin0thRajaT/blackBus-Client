import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CustomAppBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          BlackBus
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {user && (
          <>
            {user.role === "admin" ? ( // Check if user is admin
              <>
                <Button color="inherit" onClick={handleMenuClick}>
                  Manage
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    component={Link}
                    to="/admin/booked-tickets"
                    onClick={handleMenuClose}
                  >
                    View Booked Tickets
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/create-bus"
                    onClick={handleMenuClose}
                  >
                    Create Bus
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/bookings">
                Bookings
              </Button>
            )}
          </>
        )}
        {user ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
