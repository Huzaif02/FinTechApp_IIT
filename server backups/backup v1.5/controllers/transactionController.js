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