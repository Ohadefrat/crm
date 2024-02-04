"use client";
import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import "../app/globals.css";
import RegisterPage from "@/app/components/Register";

const Login = () => {
  return (
    <div>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <RegisterPage></RegisterPage>
      </Box>
    </div>
  );
};

export default Login;
