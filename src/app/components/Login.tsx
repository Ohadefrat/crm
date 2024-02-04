"use client";
import jwt from "jsonwebtoken";

import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import Cookies from "js-cookie";

const secretKey = "Oh@D3Fr@T";

const LoginPage = () => {
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
        console.error("Error login user:", User.statusText);
      }
    } catch (error) {
      console.error("Error login user:", error);
    }
  };
  return (
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
              color: "black", // Optionally, set text color to white or another contrasting color
              "&:hover": {
                backgroundColor: "black !important", // Change color on hover if needed
                color: "white", // Optionally, set text color to white or another contrasting color
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
