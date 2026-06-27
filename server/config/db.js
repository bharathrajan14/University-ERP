// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

/**
 * Asynchronously connects to MongoDB using the URI specified in environment variables.
 */
const connectDB = async () => {
  try {
    // Attempt to establish connection using mongoose.connect()
    // process.env.MONGO_URI holds the Atlas connection string
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log success message with the host name of the database connected
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error message if connection fails
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Exit the process with code 1 (failure) to stop the server if DB is required
    process.exit(1);
  }
};

// Export the connectDB function so it can be required and called in server.js
module.exports = connectDB;
