const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow the React frontend to talk to this server
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve static files (images) from the public folder
app.use('/images', express.static('public'));

// Routes (we'll uncomment these as we build each one)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

const mongoURI = `mongodb://${process.env.MONGO_HOST}/airbnb-clone?ssl=true&replicaSet=atlas-if0syb-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Connect to MongoDB then start the server
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
