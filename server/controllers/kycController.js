const { KYC } = require('../models');

// Upload KYC document
const uploadDocument = async (req, res) => {
  try {
    const { documentType, documentURL } = req.body;
    
    //Fetching the userID from user Database
    const userId = req.user.id;

    // Check if a KYC record already exists for this user
    const existingKYC = await KYC.findOne({ userId });
    if (existingKYC) {
      return res.status(400).json({ message: 'KYC document already uploaded for this user' });
    }

    // Save document details
    const kyc = await KYC.create({ userId, documentType, documentURL, status: 'Pending' });

    res.status(201).json({ message: 'Document uploaded successfully', kyc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify KYC status
const getKYCStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch KYC status
    const kycStatus = await KYC.findOne({ userId });
    console.log('UserId:', req.user.id);

    if (!kycStatus) return res.status(404).json({ message: 'KYC not found' });

    res.status(200).json({ kycStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadDocument, getKYCStatus };
