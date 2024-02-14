// theme.js

import { createTheme } from "@mui/material/styles";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#264653", // Adjust the color code to your desired primary color
    },
    secondary: {
      main: "#e9c46a",
    },
    success: {
      main: "#2a9d8f",
    },

    info: {
      main: "#f4a261",
    },
    error: {
      main: "#e92851",
    },
  },
});

export default theme;
