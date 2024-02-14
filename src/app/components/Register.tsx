import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import theme from "../style/theme";

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const RegisterPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Reset previous error messages
    setErrors({
      email: "",
      fullName: "",
      password: "",
      passwordConfirmation: "",
    });

    const email = event.target.email.value;
    const fullName = event.target.fullName.value;
    const password = event.target.password.value;
    const passwordConfirmation = event.target.passwordConfirmation.value;

    // Validate fields
    let valid = true;

    if (!email) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email is required",
      }));
      valid = false;
    }

    if (!fullName) {
      setErrors((prevState) => ({
        ...prevState,
        fullName: "Full Name is required",
      }));
      valid = false;
    }

    if (!password) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is required",
      }));
      valid = false;
    }

    if (!passwordConfirmation) {
      setErrors((prevState) => ({
        ...prevState,
        passwordConfirmation: "Confirm Password is required",
      }));
      valid = false;
    }

    if (valid) {
      try {
        const response = await fetch("/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role: "client",
            fullName,
          }),
        });

        if (response.ok) {
          // Handle successful user creation
          const data = await response.json();
          console.log("User created:", data.user);
          // window.location.href = "/"; // Replace '/' with the desired route
          router.push("/login");
        } else {
          // Handle errors
          setErrors((prevState) => ({
            ...prevState,
            email: "Email address is already registered",
          }));
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (error) {
        console.error("Failed to register user:", error);
      }
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
              border: "1px solid white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.5)", // Add box shadow
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: theme.palette.primary.main }}
            >
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
              <TextField
                required
                id="email"
                label="Email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                required
                id="fullName"
                label="Full Name"
                variant="outlined"
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
              <TextField
                required
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                required
                id="passwordConfirmation"
                label="Confirm Password"
                type="password"
                variant="outlined"
                error={!!errors.passwordConfirmation}
                helperText={errors.passwordConfirmation}
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography variant="body2">
                  <LinkStyled href="/login">Sign in instead</LinkStyled>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default RegisterPage;
