const Log = require('../models/Log/Logs'); // Import Logs model
const User = require('../models/User/User'); // Import User model
const Agent = require('../models/Agent/Agent'); // Import Agent model
const Admin = require('../models/Admin/Admin'); // Import Admin model
const Partner = require('../models/Partner/Partner'); // Import Partner model

const Notification = require('../models/Notifications/Notification'); // Import Notifications model
const { exportDataService } = require('../services/backupService'); // Backup service
const { getServerTrafficMetrics, getAnalyticsMetrics } = require('../services/analyticsService'); // Analytics services

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');

//Super Admin Login uses same database of admin

// Super Admin Login
exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await Admin.findOne({ email });
    if (!superAdmin || superAdmin.role !== 'super_admin') {
      return res.status(404).json({ message: 'Super Admin not found or unauthorized.' });
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: superAdmin._id, fullName: superAdmin.fullName, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Super Admin login successful',
      token,
      superAdmin: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error during Super Admin login:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Monitor User Activity
exports.monitorUserActivity = async (req, res) => {
  try {
    // Fetch only logs where the action was performed by a user
    const userLogs = await Log.find({ performedByRole: 'user' })
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the last 50 user logs

    res.status(200).json({
      message: 'User activity monitored successfully',
      logs: userLogs,
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Monitor Admin Activity
exports.monitorAdminActivity = async (req, res) => {
  try{
    //Fetching only admin logs
    const adminLogs = await Log.find({ performedByRole: 'admin' })
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the last 50 user logs

    res.status(200).json({
      message: 'Admin activity monitored successfully',
      logs: userLogs,
    });
  } catch (error) {
    console.error('Error fetching Admin activity logs:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//Monitor Agent Activity
exports.monitorAgentActivity = async (req, res) => {
  try{
    //Fetching only admin logs
    const agentLogs = await Log.find({ performedByRole: 'agent' })
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the last 50 user logs

    res.status(200).json({
      message: 'Agent activity monitored successfully',
      logs: agentLogs,
    });
  } catch (error) {
    console.error('Error fetching Agent activity logs:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//Monitor Partner Activity
exports.monitorPartnerActivity = async (req, res) => {
  try{
    //Fetching only admin logs
    const partnerLogs = await Log.find({ performedByRole: 'partner' })
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the last 50 user logs

    res.status(200).json({
      message: 'Partner activity monitored successfully',
      logs: agentLogs,
    });
  } catch (error) {
    console.error('Error fetching Partner activity logs:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Monitor Server Traffic
exports.monitorServerTraffic = async (req, res) => {
  try {
    const trafficMetrics = await getServerTrafficMetrics(); // Call traffic monitoring service
    res.status(200).json({
      message: 'Server traffic monitored successfully',
      trafficMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View Server Logs
exports.viewServerLogs = async (req, res) => {
  try {
    const serverLogs = await Log.find({}).sort({ createdAt: -1 }); // Fetch all logs
    res.status(200).json({
      message: 'Server logs fetched successfully',
      logs: serverLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Analytics Dashboard
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsMetrics(); // Call analytics service for metrics
    res.status(200).json({
      message: 'Analytics dashboard fetched successfully',
      analytics: analyticsData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View Notifications
exports.getSystemNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }); // Fetch all notifications
    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications,
    });
  } catch (error) {c
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create System Notification
exports.createSystemNotification = async (req, res) => {
  try {
    const { title, content, targetAudience } = req.body;

    const notification = await Notification.create({
      title,
      content,
      targetAudience,
      createdBy: req.user.id, // Log who created the notification
    });

    res.status(201).json({
      message: 'System notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export Data for Backup
exports.exportData = async (req, res) => {
  try {
    // Fetch data from the service
    const backupData = await exportDataService();

    // Generate current timestamp
    const date = new Date(); // Current date and time
    // Format the date to a readable string for the filename
    const formattedDate = date.toISOString().replace(/:/g, '-');
    // Generate file path for the backup file
    const filePath = path.join(__dirname, '../backups', `backup-${formattedDate}.json`);

    console.log(date);
    console.log('Backup folder path:', filePath);

    

    // Ensure the backups directory exists
    if (!fs.existsSync(path.join(__dirname, '../backups'))) {
      fs.mkdirSync(path.join(__dirname, '../backups'));
      console.log('Backups folder created successfully');
    } else {
      console.log('Backups folder already exists');
    }

    // Write data to a JSON file
    console.log('Writing backup data to file...');
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`Backup file created at: ${filePath}`);

    // Send the file as a downloadable response
    res.download(filePath, 'backup.json', (err) => {
      if (err) {
        console.error('Error sending the file:', err.message);
        return res.status(500).json({ message: 'Failed to send backup file', error: err.message });
      }

      // Clean up: Delete the file after sending it
      // console.log('Deleting backup file after download...');
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error during backup creation:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//User Management
// Fetch All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }); // Fetch all users
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create User
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = await User.create({ fullName, email, mobile, password, role });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Agent Management
// Fetch All Agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).populate('assignedPartner'); // Populate partner details if needed
    res.status(200).json({
      message: 'Agents fetched successfully',
      agents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a New Agent
exports.createAgent = async (req, res) => {
  try {
    const { fullName, email, phone, assignedPartner } = req.body;

    // Check if the agent already exists
    const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email or phone already exists' });
    }

    // Generate a random password for the agent
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new agent
    const newAgent = await Agent.create({
      fullName,
      email,
      mobile: phone,
      assignedPartner,
      password: hashedPassword, // Store hashed password
    });

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: newAgent._id,
        fullName: newAgent.fullName,
        email: newAgent.email,
        mobile: newAgent.mobile,
        assignedPartner: newAgent.assignedPartner,
      },
      rawPassword: password, // Provide raw password for admin to share
    });
  } catch (error) {
    console.error('Error creating agent:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Agent Details
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedAgent = await Agent.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent updated successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error updating agent:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an Agent
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAgent = await Agent.findByIdAndDelete(id);
    if (!deletedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent deleted successfully',
      agent: deletedAgent,
    });
  } catch (error) {
    console.error('Error deleting agent:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Admin Management
// Fetch All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}); // Fetch all admin users
    res.status(200).json({
      message: 'Admins fetched successfully',
      admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a New Admin
exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    // Validate role
    if (!['admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        mobile: newAdmin.mobile,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Admin Details
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, mobile, role } = req.body;

    // Validate role if it's being updated
    if (role && !['admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { fullName, email, mobile, role },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin updated successfully',
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error('Error updating admin:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin deleted successfully',
      admin: deletedAdmin,
    });
  } catch (error) {
    console.error('Error deleting admin:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch All Partners
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find({});
    res.status(200).json({
      message: 'Partners fetched successfully',
      partners,
    });
  } catch (error) {
    console.error('Error fetching partners:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a New Partner
exports.createPartner = async (req, res) => {
  try {
    const { name, email, phone, address, areaAllotted, communicationChannel } = req.body;

    // Check if the partner already exists
    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ message: 'Partner with this email already exists' });
    }

    // Create a new partner
    const newPartner = await Partner.create({
      name,
      email,
      phone,
      address,
      areaAllotted,
      communicationChannel,
    });

    res.status(201).json({
      message: 'Partner created successfully',
      partner: newPartner,
    });
  } catch (error) {
    console.error('Error creating partner:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Partner Details
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPartner = await Partner.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({
      message: 'Partner updated successfully',
      partner: updatedPartner,
    });
  } catch (error) {
    console.error('Error updating partner:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a Partner
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPartner = await Partner.findByIdAndDelete(id);
    if (!deletedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({
      message: 'Partner deleted successfully',
      partner: deletedPartner,
    });
  } catch (error) {
    console.error('Error deleting partner:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};