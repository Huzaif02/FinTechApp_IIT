const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// partnerController.js
const Partner = require('../models/Partner/Partner'); // Partner model

// Add a New Partner
exports.addPartner = async (req, res) => {
    try {
        const { name, email, phone, address, areaAllotted } = req.body;
        console.log(req.body)
        // Check if the partner already exists
        const existingPartner = await Partner.findOne({ email });
        if (existingPartner) {
            return res.status(400).json({ message: 'Partner with this email already exists' });
        }

        // Generate a random password for the partner
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new partner
        const partner = await Partner.create({
            name,
            email,
            phone,
            address,
            areaAllotted,
            password: hashedPassword, // Store hashed password
        });

        // Send email with login credentials
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can configure any email service here
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Partner Account Created',
            text: `Hello ${name},
                    
Your partner account has been created successfully. Here are your login credentials:

Email: ${email}
Password: ${password}
                    
Please log in to your account and change your password immediately.
                    
Thank you,
Admin Team`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Partner created but failed to send email', error: err.message });
            }
            console.log('Email sent:', info.response);
            res.status(201).json({ message: 'Partner added successfully. Login credentials sent via email.', partner });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch All Partners
exports.getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.status(200).json({ message: 'Partners fetched successfully', partners });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Specific Partner Details
exports.getPartnerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await Partner.findById(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.status(200).json({ message: 'Partner details fetched successfully', partner });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Partner Details
exports.updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        const partner = await Partner.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true }
        );
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.status(200).json({ message: 'Partner details updated successfully', partner });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove a Partner
exports.removePartner = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await Partner.findByIdAndDelete(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.status(200).json({ message: 'Partner removed successfully', partner });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
