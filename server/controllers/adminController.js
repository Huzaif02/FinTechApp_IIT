// adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Admin, User, KYC, Transaction} = require('../models'); //models

// Admin Registration
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, mobile, password, confirmPassword, role } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { mobile }] });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists with this email or mobile number" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = await Admin.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: role || 'admin', // Default role is 'admin'
        });

        res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: newAdmin._id,
                fullName: newAdmin.fullName,
                email: newAdmin.email,
                mobile: newAdmin.mobile,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



