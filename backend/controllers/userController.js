const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users_db.json');

// Helper function to read users from the file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to write users to the file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Get all users
exports.getAllUsers = (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
};

// Add a new user
exports.addUser = (req, res) => {
  const users = readUsersFromFile();
  const newUser = { ...req.body, id: Date.now() };
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
};

// Edit an existing user
exports.editUser = (req, res) => {
  const users = readUsersFromFile();
  const { id } = req.params;
  const index = users.findIndex(user => user.id === parseInt(id));

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeUsersToFile(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Delete a user
exports.deleteUser = (req, res) => {
  const users = readUsersFromFile();
  const { id } = req.params;
  const index = users.findIndex(user => user.id === parseInt(id));

  if (index !== -1) {
    users.splice(index, 1);
    writeUsersToFile(users);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};