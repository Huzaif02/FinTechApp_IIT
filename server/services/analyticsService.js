const Log = require('../models/Log/Logs'); // Logs model
const User = require('../models/User/User'); // User model
const Transaction = require('../models/User/Transaction'); // Transaction model

// Get server traffic metrics
exports.getServerTrafficMetrics = async () => {
  try {
    // Example: Count requests by endpoint and IP
    const trafficLogs = await Log.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
    ]);

    return {
      trafficLogs,
      totalRequests: trafficLogs.reduce((sum, log) => sum + log.count, 0),
    };
  } catch (error) {
    throw new Error('Error fetching traffic metrics: ' + error.message);
  }
};

// Get analytics metrics
exports.getAnalyticsMetrics = async () => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalTransactions = await Transaction.countDocuments({});
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    const totalLogs = await Log.countDocuments({});

    return {
      totalUsers,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.totalAmount || 0,
      totalLogs
    };
  } catch (error) {
    throw new Error('Error fetching analytics metrics: ' + error.message);
  }
};
