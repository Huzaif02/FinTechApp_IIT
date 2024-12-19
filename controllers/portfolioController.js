const Portfolio = require('../models/Portfolio');

// Get portfolio details
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch portfolio
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get portfolio insights
const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Dummy insights (replace with actual logic)
    const insights = { totalValue: 50000, riskLevel: 'Moderate' };

    res.status(200).json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPortfolio, getInsights };
