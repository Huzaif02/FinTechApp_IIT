const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// partnerController.js
const Partner = require('../models/Partner/Partner'); // Partner model
const Agent = require('../models/Agent/Agent'); // Agent model
const Campaign = require('../models/Partner/Campaign'); // Campaign model
const User = require('../models/User/User'); // User model
const Transaction = require('../models/User/Transaction'); // Transaction model
const Engagement = require('../models/Partner/Engagement'); // Engagement model
const Notification = require('../models/Notifications/Notification');
const DailyActivity = require('../models/Agent/DailyActivity');
const PartnerReport = require('../models/Partner/PartnerReport');


// Partner Login Function
exports.partnerLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate email and password
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
  
      // Find the partner
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ message: 'Invalid email or password.' });
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, partner.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: partner._id, name: partner.name, role: 'partner' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
        res.status(200).json({
        message: 'Login successful',
        token,
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          role: partner.role || 'partner',
        },
      });
    } catch (error) {
      console.error('Error during partner login:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

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
        const { id } = req.user;
        console.log(req.user);
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



exports.getDashboard = async (req, res) => {
  try {
    const { id: partnerId } = req.user; // Partner ID from authentication middleware

    // 1. Partner Profile Summary
    const partner = await Partner.findById(partnerId).select('name email phone areaAllotted');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    // 2. Agent Overview
    const totalAgents = await Agent.countDocuments({ assignedPartner: partnerId });
    const activeAgents = await Agent.countDocuments({ assignedPartner: partnerId, status: 'Active' });
    const inactiveAgents = totalAgents - activeAgents;

    // 3. Agent Performance Metrics
    const agentPerformance = await Agent.aggregate([
      { $match: { assignedPartner: partnerId } },
      {
        $lookup: {
          from: 'DailyActivity', // Assuming tasks are stored in the 'dailyactivities' collection
          localField: '_id',
          foreignField: 'agentId',
          as: 'tasks',
        },
      },
      {
        $project: {
          name: 1,
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Completed'] },
              },
            },
          },
          totalTasks: { $size: '$tasks' },
        },
      },
    ]);
    const topPerformingAgents = agentPerformance
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 3); // Top 3 performing agents

    // 4. User Engagement Metrics
    const totalEngagedUsers = await Engagement.countDocuments({ partnerId });
    const engagementBreakdown = await Engagement.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: '$engagementType',
          count: { $sum: 1 },
        },
      },
    ]);
    const recentEngagements = await Engagement.find({ partnerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('engagementType userId status createdAt');

    // 5. Financial Metrics
    const totalRevenue = await Transaction.aggregate([
      { $match: { partnerId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const revenueTrends = await Transaction.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group by date
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);
    const pendingTransactions = await Transaction.countDocuments({ partnerId, status: 'Pending' });
    const recentTransactions = await Transaction.find({ partnerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount status createdAt');

    // 6. Notifications
    const notifications = await Notification.find({ targetAudience: 'Partner' })
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Analytics and Growth Metrics
    const userEngagementGrowth = await Engagement.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $month: '$createdAt' }, // Group by month
          totalEngagements: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueGrowth = await Transaction.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $month: '$createdAt' }, // Group by month
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const agentActivityTrends = await DailyActivity.aggregate([
      {
        $lookup: {
          from: 'agents', // Assuming tasks are stored in the 'dailyactivities' collection
          localField: 'agentId',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $match: { 'agent.assignedPartner': partnerId },
      },
      {
        $group: {
          _id: { $month: '$createdAt' }, // Group by month
          totalTasks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Prepare Dashboard Data
    const dashboardData = {
      profile: partner,
      metrics: {
        agents: {
          total: totalAgents,
          active: activeAgents,
          inactive: inactiveAgents,
          performance: {
            topPerformers: topPerformingAgents,
          },
        },
        engagement: {
          totalEngagedUsers,
          engagementBreakdown,
          recentEngagements,
        },
        financials: {
          totalRevenue: totalRevenue[0]?.total || 0,
          revenueTrends,
          pendingTransactions,
          recentTransactions,
        },
        notifications,
        analytics: {
          userEngagementGrowth,
          revenueGrowth,
          agentActivityTrends,
        },
      },
    };

    res.status(200).json({
      message: 'Dashboard fetched successfully',
      dashboard: dashboardData,
    });
  } catch (error) {
    console.error('Error fetching partner dashboard:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    console.log("Called getAll Reports from admin");
    const reports = await PartnerReport.find().populate('partnerId', 'name email');
    res.status(200).json({ message: 'Reports fetched successfully', reports });
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// try {
//   const partners = await Partner.find();
//   res.status(200).json({ message: 'Partners fetched successfully', partners });
// } catch (error) {
//   res.status(500).json({ message: 'Server error', error: error.message });
// }

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await PartnerReport.findById(id).populate('partnerId', 'name email');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report fetched successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 
 
  // implements following things to be showned on the dashboard of the partner
  // 1. partner profile summary : Partner Name, Email, Phone Number, Assigned areaAllotted
  // 2. Agent Overview: total number of agent managed by that partner, Active agents, inactive agents
  // 3. Agent performance metrics: Tasks Assigned vs. Tasks Completed (e.g., daily, weekly, monthly),Top Performing Agents (based on completed tasks or revenue generated), Agents with Pending Tasks or Poor Performance
  // 4. User Engagement: Total Users Engaged by the Partner, Engagement Breakdown by Type: Calls, Messages, Emails  , Recent Engagement Activities, Pending Engagements or Follow-Ups
  // 5. Financial Metrics: Total Revenue Generated by Agents, Revenue Trends (e.g., daily, weekly, monthly), Pending Transactions, Most Recent Transactions: Amount, Status (e.g., Completed, Pending, Failed), Date   
  // 6. Notifications: Recent System Notifications, Updates from Admin or Super Admin, Partner-Specific Alerts (e.g., campaign status updates, pending tasks)
  // 7. Analytics and Growth Metrics: Key Performance Indicators (KPIs): User Engagement Growth, Revenue Growth Over Time , Agent Activity Trends, 