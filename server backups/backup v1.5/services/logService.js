const Log = require('../models/Log/Logs');

// Get all logs
exports.getAllLogs = async () => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 });
    return logs;
  } catch (error) {
    throw new Error('Error fetching logs: ' + error.message);
  }
};

// Filter logs by role
exports.getLogsByRole = async (role) => {
  try {
    const logs = await Log.find({ performedByRole: role }).sort({ createdAt: -1 });
    return logs;
  } catch (error) {
    throw new Error('Error filtering logs: ' + error.message);
  }
};

// Get logs by action
exports.getLogsByAction = async (action) => {
  try {
    const logs = await Log.find({ action }).sort({ createdAt: -1 });
    return logs;
  } catch (error) {
    throw new Error('Error filtering logs by action: ' + error.message);
  }
};
