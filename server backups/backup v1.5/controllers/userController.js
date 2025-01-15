const { User, KYC} = require('../models'); //models
const mongoose = require('mongoose');

// Fetch All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Specific User Details
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the `id` parameter is an ObjectId or a mobile number
        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        // Query based on whether it's an ObjectId or a mobile number
        const query = isObjectId ? { _id: id } : { mobile: id };

        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User details fetched successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Status
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: status === 'active' },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch All Users with Their KYC Details
exports.getAllUsersKYC = async (req, res) => {
    try {
        const usersWithKYC = await KYC.find({});
        res.status(200).json({ message: 'All users with KYC details fetched successfully', usersWithKYC });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Specific User KYC Details
exports.getKYCDetails = async (req, res) => {
    try {
        const { id } = req.params; // Extract userId from path parameter

        const kycRecord = await KYC.findOne({ userId: id });
        if (!kycRecord) {
            return res.status(404).json({ message: 'KYC not found for the specified user' });
        }

        res.status(200).json({ message: 'KYC record fetched successfully', kycRecord });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update KYC Status for Specific User
exports.updateKYCStatus = async (req, res) => {
    try {
        const { id } = req.params; // Extract userId from path parameter
        const { status, comments } = req.body;

        const kyc = await KYC.findByIdAndUpdate(
            id,
            { verificationStatus: status, comments },
            { new: true }
        );
        if (!kyc) return res.status(404).json({ message: 'KYC not found' });

        res.status(200).json({ message: 'KYC status updated successfully', kyc });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Pending KYC Applications
exports.getPendingKYCs = async (req, res) => {
    try {
        const pendingKYCs = await KYC.find({ verificationStatus: 'Pending' });
        res.status(200).json({ message: 'Pending KYCs fetched successfully', pendingKYCs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};