// index.js
const express = require('express');
const connectDB = require('./db'); // Import the database connection
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
