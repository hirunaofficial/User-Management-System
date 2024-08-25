import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Open the dialog for adding a new user
  const openAddUserDialog = () => {
    setCurrentUser({ id: null, name: '', email: '' });
    setEmailError('');
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing user
  const openEditUserDialog = (user) => {
    setCurrentUser(user);
    setEmailError('');
    setIsDialogOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Save the new or edited user
  const saveUser = async () => {
    if (currentUser.name && currentUser.email) {
      if (!validateEmail(currentUser.email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }

      try {
        if (currentUser.id === null) {
          // Add new user via API
          const response = await axios.post('http://localhost:3001/api/users', currentUser);
          setUsers([...users, response.data]);
        } else {
          // Update existing user via API
          const response = await axios.put(`http://localhost:3001/api/users/${currentUser.id}`, currentUser);
          setUsers(users.map((user) => (user.id === currentUser.id ? response.data : user)));
        }
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>User Management System</Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={openAddUserDialog}
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>

      <Typography variant="h6" gutterBottom>User List</Typography>

      {users.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No users found.
        </Typography>
      ) : (
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => openEditUserDialog(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user.id)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{currentUser.id === null ? 'Add User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentUser.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentUser.email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={saveUser} color="primary" variant="contained">
            {currentUser.id === null ? 'Add User' : 'Save Changes'}
          </Button>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;