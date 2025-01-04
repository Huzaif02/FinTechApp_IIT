const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import services
const { getServerTrafficMetrics, getAnalyticsMetrics } = require('./services/analyticsService');
const { exportDataService } = require('./services/backupService');
const { createNotification, getAllNotifications } = require('./services/notificationService');
const { getAllLogs, getLogsByRole, getLogsByAction } = require('./services/logService');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected...');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Test Services
const testServices = async () => {
  try {
    // Connect to DB
    await connectDB();

    // === Test Analytics Services ===
    console.log('Testing Analytics Services...');
    const trafficMetrics = await getServerTrafficMetrics();
    console.log('Server Traffic Metrics:', trafficMetrics);

    const analyticsMetrics = await getAnalyticsMetrics();
    console.log('Analytics Metrics:', analyticsMetrics);

    // === Test Backup Service ===
    console.log('Testing Backup Service...');
    const backupData = await exportDataService();
    console.log('Backup Data:', backupData);

    // === Test Notification Services ===
    console.log('Testing Notification Services...');
    const notification = await createNotification({
      title: 'System Maintenance',
      content: 'The system will be under maintenance tonight from 12 AM to 2 AM.',
      targetAudience: 'All',
      createdBy: '64e3f5f5b8c0d50023a6f7d2', // Replace with a valid admin ID
    });
    console.log('Created Notification:', notification);

    const notifications = await getAllNotifications();
    console.log('All Notifications:', notifications);

    // === Test Log Services ===
    console.log('Testing Log Services...');
    const logs = await getAllLogs();
    console.log('All Logs:', logs);

    const roleLogs = await getLogsByRole('Admin');
    console.log('Logs for Admin Role:', roleLogs);

    const actionLogs = await getLogsByAction('Create Notification');
    console.log('Logs for Action "Create Notification":', actionLogs);

    // Disconnect from DB
    await disconnectDB();
  } catch (error) {
    console.error('Error testing services:', error.message);
  }
};

// Run Tests
testServices();
