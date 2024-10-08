import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and fetch user data
      axios
        .get("http://localhost:5000/api/auth/user", {
          headers: { "x-auth-token": token },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token"); // Clear token on error
          setUser(null); // Reset user state on error
          navigate("/login"); // Redirect to login if token is invalid
        });
    }
  }, [navigate]); // Adding navigate to the dependency array

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      if (!token) {
        console.error("No token returned from login");
        throw new Error("No token returned from login");
      }
      localStorage.setItem("token", token);

      // Fetch user data after successful login
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/user",
        {
          headers: { "x-auth-token": token },
        }
      );
      if (!userResponse.data) {
        console.error("No user data returned from /api/auth/user");
        throw new Error("No user data returned");
      }
      setUser(userResponse.data); // Set user data
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Login failed:", error.response.data);
      throw new Error(error.response.data.msg);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Fetch user data after successful registration
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/user",
        {
          headers: { "x-auth-token": token },
        }
      );

      setUser(userResponse.data); // Set user data
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      throw new Error(error.response.data.msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
