"use client";
import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import "../app/globals.css";
import LoginPage from "@/app/components/Login";

const Login = () => {
  return (
    <div>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <LoginPage></LoginPage>
      </Box>
    </div>
  );
};

export default Login;
