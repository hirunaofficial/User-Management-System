import React, { useState } from 'react';
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Open the dialog for adding a new user
  const openAddUserDialog = () => {
    setCurrentUser({ id: null, name: '', email: '' });
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing user
  const openEditUserDialog = (user) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  // Save the new or edited user
  const saveUser = () => {
    if (currentUser.name && currentUser.email) {
      if (currentUser.id === null) {
        // Add new user
        setUsers([...users, { ...currentUser, id: Date.now() }]);
      } else {
        // Update existing user
        setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
      }
      setIsDialogOpen(false);
    }
  };

  // Delete a user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
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
      <List>
        {users.map((user) => (
          <ListItem key={user.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => openEditUserDialog(user)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user.id)}>
                <Delete />
              </IconButton>
            </>
          }>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
      </List>

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
