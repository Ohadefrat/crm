import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TextField,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

interface User {
  id: string;
  fullName: string;
  password: string;
  email: string;
  avatarUrl: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Initialize userForm with default values when adding a new user
  const [userForm, setUserForm] = useState<User>({
    id: "", // Initialize with an empty string for id
    fullName: "",
    password: "",
    email: "",
    avatarUrl: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  useEffect(() => {
    // Fetch users from your API endpoint
    fetchUsersFromAPI()
      .then((data) => {
        // Transform the data to match your User type
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error("Data received from the API is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Empty dependency array means this effect runs once on component mount

  const fetchUsersFromAPI = async () => {
    try {
      const response = await fetch("/api/getAllUsers"); // Replace with your API endpoint URL
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  const handleToggleDrawer = (user?: User) => () => {
    if (user) {
      // If editing an existing user, set both editingUser and userForm
      setEditingUser(user);
      setUserForm(user);
    } else {
      // If adding a new user, clear editingUser and userForm
      setEditingUser(null);
      setUserForm({
        id: "", // Add an empty string for id
        fullName: "",
        password: "",
        email: "",
        avatarUrl: "",
        role: "",
      });
    }
    setDrawerOpen(!drawerOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Create a copy of the user form with the updated field
    const updatedUserForm = {
      ...(userForm || {}), // Use the existing userForm if it exists, or an empty object if it's null
      [name]: value,
    };

    setUserForm(updatedUserForm);
  };
  const updateUser = (updatedUserForm: User) => {
    // Update existing user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUserForm.id ? updatedUserForm : user
      )
    );
  };

  const handleAddOrUpdateUser = async () => {
    if (userForm) {
      try {
        const email = userForm.email;
        const username = email.split("@")[0];
        const endpoint = editingUser ? "/api/update-user" : "/api/create-user";
        const method = editingUser ? "PUT" : "POST";

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingUser ? editingUser.id : undefined,
            email: userForm.email,
            password: userForm.password,
            role: "client",
            fullName: userForm.fullName || username,
            avatarUrl: userForm.avatarUrl,
          }),
        });

        if (response.ok) {
          // Handle successful user creation/update
          const data = await response.json();
          console.log(
            editingUser ? "User updated:" : "User created:",
            data.user
          );

          if (editingUser) {
            // Update existing user
            const updatedUsers = users.map((user) =>
              user.id === editingUser.id ? { ...user, ...userForm } : user
            );
            setUsers(updatedUsers);
          } else {
            // Add new user
            const newUser = { ...userForm };
            setUsers([...users, newUser]);
          }

          setDrawerOpen(false);

          // Clear the userForm state after submitting
          setUserForm({
            id: "",
            fullName: "",
            password: "",
            email: "",
            avatarUrl: "",
            role: "",
          });
          setEditingUser(null);
        } else {
          // Handle errors
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (error) {
        console.error(
          `Failed to ${editingUser ? "update" : "register"} user:`,
          error
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Send the user ID to delete
      });

      if (response.ok) {
        // Handle successful user deletion
        console.log("User deleted successfully");

        // Update the users list in your state, removing the deleted user
        setUsers(users.filter((user) => user.id !== id));
      } else {
        // Handle errors
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(users.map((user) => user)); // Use user objects
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    user: User // Change the parameter type to User
  ) => {
    event.stopPropagation();
    const isSelected = selectedUsers.some(
      (selectedUser) => selectedUser.id === user.id
    );

    if (isSelected) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const nonAdminUsers = selectedUsers.filter(
        (user) => user.role !== "admin"
      );

      const selectedUserIds = nonAdminUsers.map((user) => user.id);
      const response = await fetch("/api/delete-selected-users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedUserIds }), // Send an array of user IDs to delete
      });

      if (response.ok) {
        // Handle successful deletion of selected users
        console.log("Selected users deleted successfully");

        // Update the users list in your state, removing the deleted users
        setUsers(users.filter((user) => !selectedUserIds.includes(user.id)));
        setSelectedUsers([]);
      } else {
        // Handle errors
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to delete selected users:", error);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleToggleDrawer()}
        >
          Add User
        </Button>
        {selectedUsers.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
        )}
      </Box>
      <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer()}>
        <Box sx={{ width: 250 }} role="presentation" padding={2}>
          <Typography variant="h6" marginBottom={2}>
            {editingUser ? "Update User" : "Add New User"}
          </Typography>
          <TextField
            label="Email"
            name="email"
            value={userForm?.email || ""}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            value={userForm?.password || ""}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Full Name"
            name="fullName"
            value={userForm?.fullName || ""}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />

          <TextField
            label="Avatar URL"
            name="avatarUrl"
            value={userForm?.avatarUrl || ""}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddOrUpdateUser}
            >
              {editingUser ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all users" }}
                />
              </TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover style={{ cursor: "pointer" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user)}
                    onChange={(event) => handleCheckboxClick(event, user)}
                    inputProps={{ "aria-labelledby": user.id }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar alt={user.fullName} src={user.avatarUrl} />
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role !== "admin" && ( // Check if user.role is not 'admin'
                    <>
                      <IconButton
                        onClick={() => handleDelete(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleToggleDrawer(user)}
                        color="info"
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserList;
