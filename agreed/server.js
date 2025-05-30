// Import required modules
const express = require('express');
const cors = require('cors');
const app = express();

// Import route handlers
const userRoutes = require('./routes/userRoutes');
const contractRoutes = require('./routes/contractRoutes');
const archivedRoutes = require('./routes/archivedRoutes');

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mount route handlers
app.use('/user', userRoutes);          // Routes for user actions (login, signup, etc.)
app.use('/contracts', contractRoutes); // Routes for active loan contracts
app.use('/archived', archivedRoutes);  // Routes for archived contracts

// Serve frontend static files (if any exist in the 'frontend' folder)
app.use('/', express.static('frontend'));

// Basic error handler for bad requests
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(400).json({ success: false, message: "Invalid request data." });
});

// Start server unless running in a test environment
const PORT = 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing or further use
module.exports = app;
