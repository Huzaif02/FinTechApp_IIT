const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  digilockerApiKey: process.env.DIGILOCKER_API_KEY || '',
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};
