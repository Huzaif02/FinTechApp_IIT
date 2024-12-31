// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const adminController = require('../controllers/adminController');
const agentController = require('../controllers/agentController');
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const partnerController = require('../controllers/partnerController')

// Admin Registration
router.post('/register', adminController.registerAdmin);

// Admin Login
router.post('/login', adminController.loginAdmin);

// User Management
router.get('/users', adminAuthMiddleware, userController.getAllUsers);
router.get('/users/:id', adminAuthMiddleware, userController.getUserDetails);
router.put('/users/:id/status', adminAuthMiddleware, userController.updateUserStatus);

// KYC Management
router.get('/kyc', adminAuthMiddleware, userController.getAllUsersKYC); // Fetch all users with KYC details
router.get('/kyc/:id', adminAuthMiddleware, userController.getKYCDetails); // Fetch specific user KYC details
router.get('/pendingkyc', adminAuthMiddleware, userController.getPendingKYCs); // Fetch users with Pending KYC status
router.put('/kyc/:id', adminAuthMiddleware, userController.updateKYCStatus); // Update KYC status for a specific user

// Transaction Monitoring
router.get('/transactions', adminAuthMiddleware, transactionController.getAllTransactions);
router.get('/transactions/:id', adminAuthMiddleware, transactionController.getTransactionById);

// Agent Management
router.post('/agent/addagent', adminAuthMiddleware, agentController.addAgent);
router.get('/agent', adminAuthMiddleware, agentController.getAllAgents); // Fetch all agents
router.get('/agent/:id', adminAuthMiddleware, agentController.getAgentDetails); // Fetch specific agent details
router.delete('/agent/:id', adminAuthMiddleware, agentController.removeAgent); // Remove an agent
router.get('/agent/:id/progress', adminAuthMiddleware, agentController.getAgentProgress); // Monitor agent progress
router.put('/agent/:id', adminAuthMiddleware, agentController.updateAgent); // Update agent details

//Admin Dashboard
router.get('/dashboard', adminAuthMiddleware, adminController.getDashboardData);

//Partner Management
router.post('/partner', adminAuthMiddleware, partnerController.addPartner); // Add a new partner
router.get('/partner', adminAuthMiddleware, partnerController.getAllPartners); // Fetch all partners
router.get('/partner/:id', adminAuthMiddleware, partnerController.getPartnerDetails); // Fetch specific partner details
router.put('/partner/:id', adminAuthMiddleware, partnerController.updatePartner); // Update partner details
router.delete('/partner/:id', adminAuthMiddleware, partnerController.removePartner); // Remove a partner


module.exports = router;