// Main server file — starts everything up, connects to the database and registers all routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow both React apps (admin dashboard + frontend) to make requests to this server
app.use(cors());

// Parse incoming JSON so we can read req.body in our controllers
app.use(express.json());

// Serve uploaded listing images and the Airbnb logo from the /public folder
// Any file in /public is accessible at http://localhost:5000/images/filename.jpg
app.use('/images', express.static('public'));

// API Routes — each file handles a different part of the app
app.use('/api/users', require('./routes/userRoutes'));               // Register & Login
app.use('/api/accommodations', require('./routes/accommodationRoutes')); // Listings CRUD
app.use('/api/reservations', require('./routes/reservationRoutes')); // Booking system

// MongoDB Atlas connection using direct shard hostnames (avoids SRV DNS issues)
// Credentials are stored in .env so they are never exposed in the code
const mongoURI = `mongodb://${process.env.MONGO_HOST}/airbnb-clone?ssl=true&replicaSet=atlas-if0syb-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
  });
