// Configure dotenv to load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Initialize Express application
const app = express();

// Connect to MongoDB Database
connectDB();

// Configure middleware
// Enable Cross-Origin Resource Sharing (CORS) to allow requests from client applications (e.g. frontend)
app.use(cors());

// Enable built-in JSON parsing middleware to parse incoming JSON payloads in request bodies
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

// Define a test route to verify the server is running and reachable
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully!',
    timestamp: new Date().toISOString()
  });
});

// Configure the port and start listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
