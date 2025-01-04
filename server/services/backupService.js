const User = require('../models/User/User');
const Transaction = require('../models/User/Transaction');

// Export data for backup
exports.exportDataService = async () => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    const transactions = await Transaction.find({});

    return {
      users,
      transactions,
    };
  } catch (error) {
    throw new Error('Error exporting data: ' + error.message);
  }
};
