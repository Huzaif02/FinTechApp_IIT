const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const { User, KYC} = require('../models'); //models
const TemporaryUser = require('../models/User/TemporaryUser');
const Agent = require('../models/Agent/Agent');

const { createSession, removeSession } = require('../middleware/sessionMiddleware');
const  { generateOTP, sendOTP}  = require('../services/otpServices');

// Pre-Register User
exports.preRegister = async (req, res) => {
  try {
    const { fullName, email, mobile, password, referredByAgent } = req.body;

    // Validate and sanitize inputs (assume validation middleware exists)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    if (await User.findOne({ mobile })) {
      return res.status(400).json({ message: 'Mobile number is already registered.' });
    }

    // Validate referredByAgent if provided
    let agentReference = null;
    if (referredByAgent) {
      const agent = await Agent.findById(referredByAgent);
      if (!agent) {
        return res.status(400).json({ message: 'Invalid agent reference ID.' });
      }
      agentReference = agent._id;
    }
    
    // Check if temporary entry exists and enforce rate-limiting
    const tempUser = await TemporaryUser.findOne({ email });
    if (tempUser && tempUser.attempts >= 5) {
      return res.status(429).json({ message: 'Too many attempts. Try again in 1 hour.' });
    }

    // Generate OTPs
    const mobileOtp = generateOTP();
    const emailOtp = generateOTP();

    // Create or update temporary user
    await TemporaryUser.findOneAndUpdate(
      { email },
      {
        fullName,
        email,
        mobile,
        mobileOtp,
        emailOtp,
        password: hashedPassword,
        referredByAgent: agentReference, // Save the agent reference
        expiresAt: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
      },
      { upsert: true, new: true }
    );

    // Send OTPs (log to console in development)
    await sendOTP(mobile, email, mobileOtp, emailOtp);

    res.status(200).json({ message: 'OTP sent to your mobile and email.' });
  } catch (error) {
    console.error('Error in preRegister:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP and Register
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { tempUserId, mobileOtp, emailOtp } = req.body;

    const tempUser = await TemporaryUser.findById(tempUserId);
    if (!tempUser) {
      return res.status(400).json({ message: 'Temporary user not found or expired.' });
    }

    if (tempUser.mobileOtp !== mobileOtp || tempUser.emailOtp !== emailOtp) {
      return res.status(400).json({ message: 'Invalid OTP(s). Please try again.' });
    }

    // Create user in the main database
    const user = await User.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      mobile: tempUser.mobile,
      password: tempUser.password,
      referredByAgent: tempUser.referredByAgent, // Use the validated agent ID or null
    });

    if (tempUser.referredByAgent) {
      await Agent.findByIdAndUpdate(
        tempUser.referredByAgent,
        { $push: { usersReferred: user._id } }, // Add the user ID to the agent's usersReferred array
        { new: true } // Return the updated agent document
      );
    }

    await TemporaryUser.findByIdAndDelete(tempUserId);

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.error('Error in verifyOtpAndRegister:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const tempUser = await TemporaryUser.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ message: 'No registration found for this email.' });
    }

    // Enforce resend limit
    if (tempUser.attempts >= 5) {
      return res.status(429).json({ message: 'Too many attempts. Try again in 1 hour.' });
    }

    // Generate new OTPs
    const mobileOtp = generateOTP();
    const emailOtp = generateOTP();

    // Update OTPs and increment attempts
    tempUser.mobileOtp = mobileOtp;
    tempUser.emailOtp = emailOtp;
    tempUser.attempts += 1;
    await tempUser.save();

    // Send OTPs
    await sendOTP(tempUser.mobile, tempUser.email, mobileOtp, emailOtp);

    res.status(200).json({ message: 'OTP resent to your mobile and email.' });
  } catch (error) {
    console.error('Error in resendOtp:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Login Endpoint
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: 'user' }, // Include user ID and role in the token
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token valid for 1 hour
      );
  
      // Add token to session collection
      await createSession(
        { id: user._id, role: 'user' }, // User info
        token,
        3600, // Token expiration time in seconds
        req.headers['user-agent'] || 'Unknown Device' // Device info
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email },
      });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Logout Endpoint Controller
  exports.logoutUser = async (req, res) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      if (!token) {
        return res.status(400).json({ message: 'No token provided for logout.' });
      }
  
      // Remove the token from the session collection
      await removeSession(token);
  
      res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      console.error('Error during logout:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User profile fetched successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.updateUserDetails = async (req, res) => {
    try {
      const updates = req.body;
  
      // Restrict certain fields from being updated
      if (updates.email || updates.mobile) {
        return res.status(403).json({ message: 'Email and mobile cannot be updated after registration' });
      }
      
      if(updates.password){
        return res.status(403).json({message : 'Password cannot be updated using this route'})
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.changeUserPassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
  
      // Hash and update the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  //---------------> For Admin and Super Admins <----------------//
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

  // Update User Profile
  exports.updateUserProfile = async (req, res) => {
    try {
      const { fullName, mobile } = req.body;
  
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { fullName, mobile },
        { new: true }
      ).select('-password');
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };