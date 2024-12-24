const Investment = require('../models/Investment');
const axios = require('axios');

// List available mutual funds
const listFunds = async (req, res) => {
  try {
    const funds = await axios.get('https://api.example.com/mutual-funds'); // Replace with actual API
    res.status(200).json({ funds: funds.data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mutual funds', error: error.message });
  }
};

// Invest in a mutual fund
const invest = async (req, res) => {
  try {
    const { fundId, amount } = req.body;
    const userId = req.user.id;

    // Save investment details
    const investment = await Investment.create({ userId, fundId, amount });

    res.status(201).json({ message: 'Investment successful', investment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request assistance for investment
const requestAssistance = (req, res) => {
  res.status(200).json({ message: 'Your request has been submitted. Our team will contact you soon.' });
};

module.exports = { listFunds, invest, requestAssistance };
