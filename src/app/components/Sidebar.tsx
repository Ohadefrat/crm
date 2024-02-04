import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/system";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface SidebarProps {
  onMenuItemClick: (menuItem: string) => void;
  onLogoutClick?: () => void; // Make onLogoutClick optional
}

const Sidebar: React.FC<SidebarProps> = ({
  onMenuItemClick,
  onLogoutClick,
}) => {
  const menuItems = ["Calendar", "Users"];
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<string | null>("Calendar");

  return (
    <div
      style={{
        position: "fixed",
        height: "100%",
        width: "20%",
        backgroundColor: "#424B54",
        color: "white",
        border: `1px solid ${theme.palette.text.secondary}`,
        borderRadius: "5px",
      }}
    >
      <List>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                onMenuItemClick(item);
                setSelectedItem(item);
              }}
              sx={{
                padding: "8px",
                marginBottom: 2,
                width: "90%", // Set your preferred width here
                ml: "5%",
                transition: " background-color 0.5s ease-out 50ms", // Add transition for smooth animation
                borderRadius: "10px",
                border:
                  selectedItem === item
                    ? "1px solid white"
                    : "1px solid transparent",
                backgroundColor:
                  selectedItem === item ? "#C5BAAF" : "transparent",
                "&:hover": {
                  backgroundColor: "#C5BAAF", // Set your hover background color
                  border: "1px solid white",
                },
              }}
            >
              <ListItemText primary={item} />
              <Divider orientation="horizontal" flexItem />
            </ListItem>
          ))}
        </Box>
      </List>
      <Button
        variant="contained"
        color="secondary"
        onClick={onLogoutClick}
        sx={{
          position: "absolute",
          bottom: "8%", // Adjust the distance from the bottom
          left: "82%", // Adjust the distance from the left
        }}
      >
        <ExitToAppIcon />
      </Button>
    </div>
  );
};

export default Sidebar;
