const Portfolio = require('../models/User/Portfolio');

// Get portfolio details
exports.getPortfolio = async (req, res) => {
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
exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Dummy insights (replace with actual logic)
    const insights = { totalValue: 50000, riskLevel: 'Moderate' };

    res.status(200).json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// -------------> User Specific <-------------- //
// Fetch user's portfolio details
exports.getPortfolioDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the portfolio for the user
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for the user.' });
    }

    res.status(200).json({
      message: 'Portfolio fetched successfully',
      portfolio,
    });
  } catch (error) {
    console.error('Error fetching portfolio details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add investment to portfolio
exports.addInvestmentToPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { investmentId, investmentType, name, units, investmentAmount, currentValue, purchaseDate } = req.body;

    // Find or create portfolio for the user
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId, investments: [], totalInvested: 0, totalCurrentValue: 0, overallReturn: 0 });
    }

    // Add the new investment
    const newInvestment = {
      investmentId,
      investmentType,
      name,
      units,
      investmentAmount,
      currentValue,
      purchaseDate,
    };
    portfolio.investments.push(newInvestment);

    // Update portfolio metrics
    portfolio.totalInvested += investmentAmount;
    portfolio.totalCurrentValue += currentValue;

    // Save the updated portfolio
    await portfolio.save();

    res.status(201).json({
      message: 'Investment added to portfolio successfully',
      portfolio,
    });
  } catch (error) {
    console.error('Error adding investment:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing investment in the portfolio
exports.updateInvestmentInPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { investmentId } = req.params;
    const { units, investmentAmount, currentValue } = req.body;

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for the user.' });
    }

    // Find the investment
    const investment = portfolio.investments.find((inv) => inv.investmentId === investmentId);
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found in portfolio.' });
    }

    // Update investment details
    portfolio.totalInvested -= investment.investmentAmount;
    portfolio.totalCurrentValue -= investment.currentValue;

    investment.units = units || investment.units;
    investment.investmentAmount = investmentAmount || investment.investmentAmount;
    investment.currentValue = currentValue || investment.currentValue;

    portfolio.totalInvested += investment.investmentAmount;
    portfolio.totalCurrentValue += investment.currentValue;

    investment.lastUpdated = Date.now();

    await portfolio.save();

    res.status(200).json({
      message: 'Investment updated successfully',
      portfolio,
    });
  } catch (error) {
    console.error('Error updating investment:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an investment from the portfolio
exports.removeInvestmentFromPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { investmentId } = req.params;

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for the user.' });
    }

    const investmentIndex = portfolio.investments.findIndex((inv) => inv.investmentId === investmentId);
    if (investmentIndex === -1) {
      return res.status(404).json({ message: 'Investment not found in portfolio.' });
    }

    const removedInvestment = portfolio.investments[investmentIndex];

    // Update portfolio metrics
    portfolio.totalInvested -= removedInvestment.investmentAmount;
    portfolio.totalCurrentValue -= removedInvestment.currentValue;

    // Remove the investment
    portfolio.investments.splice(investmentIndex, 1);

    await portfolio.save();

    res.status(200).json({
      message: 'Investment removed successfully',
      portfolio,
    });
  } catch (error) {
    console.error('Error removing investment:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch overall portfolio performance
exports.getPortfolioPerformance = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for the user.' });
    }

    const performance = {
      totalInvested: portfolio.totalInvested,
      totalCurrentValue: portfolio.totalCurrentValue,
      overallReturn: ((portfolio.totalCurrentValue - portfolio.totalInvested) / portfolio.totalInvested) * 100 || 0,
    };

    res.status(200).json({
      message: 'Portfolio performance fetched successfully',
      performance,
    });
  } catch (error) {
    console.error('Error fetching portfolio performance:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch portfolio-related transactions
exports.getPortfolioTransactions = async (req, res) => {
  try {
    // Placeholder for fetching transactions
    // You can implement this by linking it to a Transaction model
    const transactions = []; // Fetch from database or mock data

    res.status(200).json({
      message: 'Portfolio transactions fetched successfully',
      transactions,
    });
  } catch (error) {
    console.error('Error fetching portfolio transactions:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};