const KYC = require('../models/KYC');

// Upload KYC document
const uploadDocument = async (req, res) => {
  try {
    const { userId, documentType, documentURL } = req.body;

    // Save document details
    const kyc = await KYC.create({ userId, documentType, documentURL, status: 'Pending' });

    res.status(201).json({ message: 'Document uploaded successfully', kyc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify KYC status
const verifyKYC = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch KYC status
    const kycStatus = await KYC.findOne({ userId });

    if (!kycStatus) return res.status(404).json({ message: 'KYC not found' });

    res.status(200).json({ kycStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadDocument, verifyKYC };
