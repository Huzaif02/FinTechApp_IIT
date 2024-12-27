// agentController.js
const Agent = require('../models/Agent/Agent') // Agent model
const Partner = require('../models'); // Partner model
const nodemailer = require('nodemailer'); // For sending emails
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const mongoose = require('mongoose');

// // Fetch All Agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.find(); // Correctly fetch all agents from the database
        res.status(200).json({ message: 'Agents fetched successfully', agents });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Specific Agent Details
exports.getAgentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the `id` parameter is an ObjectId or a mobile number
        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        // Query based on whether it's an ObjectId or a mobile number
        const query = isObjectId ? { _id: id } : { mobile: id };

        const agent = await Agent.findOne(query).populate('assignedPartner');
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json({ message: 'Agent details fetched successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a New Agent
exports.addAgent = async (req, res) => {
    try {
        console.log("addAgent Method called");
        const { fullName, email, phone, assignedPartner } = req.body;
        console.log('Agent model:', Agent);
        // Check if the agent already exists
        const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
        if (existingAgent) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        // Generate a random password for the agent
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new agent
        const agent = await Agent.create({
            fullName,
            email,
            mobile: phone,
            assignedPartner,
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
            subject: 'Agent Account Created',
            text: `Hello ${fullName},
                    
    Your agent account has been created successfully. Here are your login credentials:

        Email: ${email}
        Password: ${password}
                    
    Please log in to your account and change your password immediately.
                    
    Thank you,
    Admin Team`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Agent created but failed to send email', error: err.message });
            }
            console.log('Email sent:', info.response);
            res.status(201).json({ message: 'Agent added successfully. Login credentials sent via email.', agent });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove an Agent
exports.removeAgent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided id is a valid ObjectId
        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        // Build the query based on whether id is ObjectId or mobile
        const query = isObjectId ? { _id: id } : { mobile: id };

        // Find and remove the agent
        const agent = await Agent.findOneAndDelete(query).populate('assignedPartner');

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json({ message: 'Agent removed successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Agent Details
exports.updateAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, assignedArea } = req.body;

        const agent = await Agent.findByIdAndUpdate(
            id,
            { name, email, phone, assignedArea },
            { new: true }
        );
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json({ message: 'Agent details updated successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Monitor Agent Progress
exports.getAgentProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const agent = await Agent.findById(id).populate('progress'); // Assuming `progress` is a reference in Agent schema
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json({ message: 'Agent progress fetched successfully', progress: agent.progress });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};