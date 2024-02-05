import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const email = event.target.email.value;
      const username = email.split("@")[0];
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
          role: "client",
          fullName: event.target.fullName.value,
        }),
      });

      if (response.ok) {
        // Handle successful user creation
        const data = await response.json();
        console.log("User created:", data.user);
        // window.location.href = "/"; // Replace '/' with the desired route
        router.push("/");
      } else {
        // Handle errors
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to register user:", error);
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
          Register
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
              maxWidth: "300px",
            },
            "& .MuiButton-root": {
              m: 1,
              width: "100%",
              maxWidth: "300px",
            },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField required id="email" label="Email" variant="outlined" />
          <TextField
            required
            id="fullName"
            label="Full Name"
            variant="outlined"
          />
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            variant="outlined"
          />

          <TextField
            required
            id="passwordConfirmation"
            label="Confirm Password"
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
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
