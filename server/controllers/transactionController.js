const Transaction = require('../models/User/Transaction');

// -------------> For Admins <-------------//

// Fetch All Transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json({ message: 'Transactions fetched successfully', transactions });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        res.status(200).json({ message: 'Transaction fetched successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --------------> For Users <-------------//
exports.getUsersTransactions = async (req, res) => {
    try {
      const userId = req.user.id; // Get the user's ID from the auth middleware
  
      // Fetch all transactions for the user
      const transactions = await Transaction.find({ userId })
        .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
        .select('amount type status createdAt'); // Exclude unnecessary fields
  
      res.status(200).json({
        message: 'All transactions fetched successfully',
        transactions,
      });
    } catch (error) {
      console.error('Error fetching all transactions:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  exports.getUsersRecentTransactions = async (req, res) => {
    try {
      const userId = req.user.id; // Get the user's ID from the auth middleware
  
      // Fetch the most recent 10 transactions for the user
      const transactions = await Transaction.find({ userId })
        .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
        .limit(10) // Limit the number of transactions returned
        .select('amount type status createdAt'); // Exclude unnecessary fields
  
      res.status(200).json({
        message: 'Recent transactions fetched successfully',
        transactions,
      });
    } catch (error) {
      console.error('Error fetching recent transactions:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };