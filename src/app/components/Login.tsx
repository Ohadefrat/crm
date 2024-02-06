"use client";
import jwt from "jsonwebtoken";

import React from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  styled,
} from "@mui/material";
import Cookies from "js-cookie";

import IconSVG from "../../../public/crm_logo.svg";

const secretKey = "Oh@D3Fr@T";
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));
const LoginPage = () => {
  const [errorMessage, setErrorMessage] = React.useState(""); // State for error message

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Your authentication logic here

    // Example: Fetch data from the form fields
    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    try {
      const User = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password, // Include password in the request if needed
        }),
      });

      if (User.ok) {
        // Successful login
        const userData = await User.json();
        if (userData.data) {
          const payload = {
            id: userData.data.id,
            email: userData.data.email,
          };

          const token = jwt.sign(payload, secretKey, {
            expiresIn: "7d",
          });

          Cookies.set("authToken", token, { path: "/", expires: 7 });
          window.location.href = "/";
        } else {
          console.error("Invalid user data structure:", userData);
        }
      } else {
        // Error in login
        const errorData = await User.json();
        console.error("Error login user:", errorData.error);
        setErrorMessage("Incorrect email or password"); // Set error message
      }
    } catch (error) {
      console.error("Error login user:", error);
      setErrorMessage("An error occurred. Please try again."); // Set error message
    }
  };

  return (
    <div className="bg-image">
      <div className="icon-container">
        <svg
          fill="#000000"
          height="70px"
          width="70px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <g>
              <polygon points="26.624,142.166 26.624,409.6 231.424,512 231.424,244.564" />
              <text
                x="80"
                y="350"
                font-family="Arial"
                font-size="100"
                fill="white"
                transform="rotate(10,80, 350)"
              >
                C
              </text>
            </g>
          </g>
          <g>
            <g>
              <polygon points="256,0 54.102,100.95 256,201.898 457.898,100.95" />
              <text
                x="220"
                y="130"
                font-family="Arial"
                font-size="100"
                fill="white"
              >
                R
              </text>
            </g>
          </g>
          <g>
            <g>
              <polygon points="280.576,244.564 280.576,512 485.376,409.6 485.376,142.166" />
              <text
                x="350"
                y="350"
                font-family="Arial"
                font-size="100"
                fill="white"
              >
                M
              </text>
            </g>
          </g>
        </svg>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "70%",
              border: "1px solid black",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                "& .MuiTextField-root": {
                  m: 1,
                  width: "100%",
                  maxWidth: "300px", // Adjust the width as needed
                },
                "& .MuiButton-root": {
                  m: 1,
                  width: "100%",
                  maxWidth: "300px", // Adjust the width as needed
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField required id="email" label="Email" variant="outlined" />
              <TextField
                required
                id="password"
                label="Password"
                type="password"
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  backgroundColor: "white !important",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "black !important",
                    color: "white",
                  },
                }}
              >
                Login
              </Button>
              {errorMessage && ( // Display error message if it exists
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ mr: 2 }}>
                  New on our platform?
                </Typography>
                <Typography variant="body2">
                  <LinkStyled href="/register">Create an account</LinkStyled>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
