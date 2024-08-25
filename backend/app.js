const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data with the querystring library
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/users', userRoutes);

module.exports = app;