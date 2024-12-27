const app = require('./app'); // Import the Express app
const dotenv = require('dotenv'); // Load environment variables
dotenv.config(); // Configure environment variables

const connectDB = require('./config/db'); // MongoDB connection

const PORT = process.env.PORT || 5000;

// Connect to the MongoDB database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
