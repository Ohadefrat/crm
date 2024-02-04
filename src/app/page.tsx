"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Component, SetStateAction, useEffect, useState } from "react";
import Sidebar from "../app/components/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import MyCalendar from "./components/Calendar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#424B54", // Adjust the color code to your desired primary color
    },
    secondary: {
      main: "#F4C18B",
    },
  },
});

export default function Home() {
  const router = useRouter();
  const authToken = Cookies.get("authToken");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [selectedMenuItem, setSelectedMenuItem] = useState("Calendar");

  const handleMenuItemClick = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
  };

  // Check for the presence of the authToken cookie
  useEffect(() => {
    if (!authToken) {
      router.replace("/login");
      // Redirect the user to the login page if the token is not present
    } else {
      router.replace("/");
    }
  }, [authToken]);

  const logout = () => {
    // Delete the authToken cookie
    Cookies.remove("authToken", { path: "/" });

    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar onMenuItemClick={handleMenuItemClick} onLogoutClick={logout} />
        <div
          style={{
            marginLeft: "20%",
            width: "80%",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {selectedMenuItem === "Calendar" && <MyCalendar theme={theme} />}
          {selectedMenuItem === "Users" && <div>Users Information</div>}

          {/* Add your content here */}
        </div>
      </div>
    </ThemeProvider>
  );
}
