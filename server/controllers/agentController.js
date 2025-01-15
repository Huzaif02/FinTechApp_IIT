
const Agent = require('../models/Agent/Agent'); // Agent model
const Partner = require('../models/Partner/Partner'); // Partner model
const nodemailer = require('nodemailer'); // For sending emails
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const mongoose = require('mongoose');

// Helper function to determine user role
const isAdminOrSuperAdmin = (role) => role === 'admin' || role === 'super_admin';

// Fetch All Agents (with role-based access control)
exports.getAllAgents = async (req, res) => {
  try {
    const { role, id: requesterId } = req.user; // Extract role and ID from req.user (provided by middleware)

    let agents;

    if (isAdminOrSuperAdmin(role)) {
      // Admin or Super Admin can fetch all agents
      agents = await Agent.find();
    } else if (role === 'partner') {
      // Partners can only fetch their own agents
      agents = await Agent.find({ assignedPartner: requesterId });
    } else {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    res.status(200).json({ message: 'Agents fetched successfully', agents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch Specific Agent Details (with role-based access control)
exports.getAgentDetails = async (req, res) => {
  try {
    const { role, id: requesterId } = req.user; // Extract role and ID from req.user (provided by middleware)
    const { id } = req.params;

    // Check if the `id` parameter is an ObjectId or a mobile number
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { mobile: id };

    let agent;

    if (isAdminOrSuperAdmin(role)) {
      // Admin or Super Admin can fetch any agent's details
      agent = await Agent.findOne(query).populate('assignedPartner');
    } else if (role === 'partner') {
      // Partners can only fetch details of their assigned agents
      agent = await Agent.findOne({ ...query, assignedPartner: requesterId }).populate('assignedPartner');
    } else if (role === 'agent') {
      // Agents can only fetch their own details
      agent = await Agent.findOne({ ...query, _id: requesterId });
    } else {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent details fetched successfully', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Add a new Agent
exports.addAgent = async (req, res) => {
    try {
      const { fullName, email, phone, assignedPartner: providedPartner } = req.body;
      const { role, id: requesterId } = req.user; // Extract role and ID of the requester from the authentication middleware
  
      let assignedPartner;
  
      // Check if the user creating the agent is a partner or an admin
      if (role === 'partner') {
        assignedPartner = requesterId; // Automatically assign the creating partner as the assignedPartner
      } else if (role === 'admin' || role === 'super_admin') {
        if (!providedPartner) {
          return res.status(400).json({ message: 'Assigned partner is required when admin creates an agent.' });
        }
        assignedPartner = providedPartner; // Use the assignedPartner ID provided by the admin
      } else {
        return res.status(403).json({ message: 'Unauthorized role. Only partners or admins can create agents.' });
      }
  
      // Check if the agent already exists
      const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
      if (existingAgent) {
        return res.status(400).json({ message: 'Agent with this email or phone already exists' });
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
  
      // Add the new agent to the Partner's agents array
      const partner = await Partner.findByIdAndUpdate(
        assignedPartner,
        { $push: { agents: agent._id } }, // Add the agent's ID to the Partner's agents array
        { new: true } // Return the updated Partner document
      );
  
      if (!partner) {
        return res.status(404).json({ message: 'Assigned partner not found' });
      }
  
      // Send email with login credentials
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Agent Account Created',
        text: `Hello ${fullName},\n\nYour agent account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password immediately.\n\nThank you,\nAdmin Team`,
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Agent created but failed to send email', error: err.message });
        }
        console.log('Email sent:', info.response);
        res.status(201).json({
          message: 'Agent added successfully and assigned to the partner. Login credentials sent via email.',
          agent,
          updatedPartner: partner,
        });
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Remove an Agent (with role-based access control)
exports.removeAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: requesterId } = req.user;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { mobile: id };

    let agent;

    if (isAdminOrSuperAdmin(role)) {
      // Admin or Super Admin can remove any agent
      agent = await Agent.findOneAndDelete(query).populate('assignedPartner');
    } else if (role === 'partner') {
      // Partners can only remove their own agents
      agent = await Agent.findOneAndDelete({ ...query, assignedPartner: requesterId }).populate('assignedPartner');
    } else {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent removed successfully', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAgent = async (req, res) => {
    try {
      const { id } = req.params; // Agent ID from route params
      const { fullName, email, phone, assignedArea } = req.body;
      const { role, id: requesterId } = req.user; // Extract role and ID of the requester from the authentication middleware
  
      let agent;
  
      if (role === 'admin' || role === 'super_admin') {
        // Admin or Super Admin can update any agent
        agent = await Agent.findByIdAndUpdate(
          id,
          { fullName, email, phone, assignedArea },
          { new: true }
        );
      } else if (role === 'partner') {
        // Partners can only update their own agents
        agent = await Agent.findOneAndUpdate(
          { _id: id, assignedPartner: requesterId }, // Ensure the agent belongs to the partner
          { fullName, email, phone, assignedArea },
          { new: true }
        );
      } else {
        // Unauthorized role
        return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
      }
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found or not authorized to update.' });
      }
  
      res.status(200).json({ message: 'Agent details updated successfully', agent });
    } catch (error) {
      console.error('Error updating agent details:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
// monitor agent progress
  exports.getAgentProgress = async (req, res) => {
    try {
      const { id } = req.params; // Agent ID
      const { role, id: requesterId } = req.user; // Extract role and requester ID from req.user
  
      let agent;
  
      if (role === 'admin' || role === 'super_admin') {
        // Admin or Super Admin can fetch progress of any agent
        agent = await Agent.findById(id).populate('progress');
      } else if (role === 'partner') {
        // Partners can fetch progress of only their assigned agents
        agent = await Agent.findOne({ _id: id, assignedPartner: requesterId }).populate('progress');
      } else if (role === 'agent') {
        // Agents can fetch only their own progress
        agent = await Agent.findOne({ _id: requesterId }).populate('progress');
      } else {
        return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
      }
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found or not authorized to access progress.' });
      }
  
      res.status(200).json({
        message: 'Agent progress fetched successfully',
        progress: agent.progress,
      });
    } catch (error) {
      console.error('Error fetching agent progress:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

