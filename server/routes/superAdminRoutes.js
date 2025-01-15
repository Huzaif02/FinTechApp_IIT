const express = require('express');
const router = express.Router();
const superAdminAuthMiddleware = require('../middleware/superAdminAuthMiddleware');
const logActivityMiddleware = require('../middleware/logActivityMiddleware'); // Import log activity middleware
const superAdminController = require('../controllers/superadminController');

// Super Admin Login
router.post('/login', logActivityMiddleware('Super Admin Login Request'),superAdminController.superAdminLogin); // Super Admin Login

// User Monitoring and Traffic
router.get('/monitor/users', superAdminAuthMiddleware, logActivityMiddleware('Monitor User Activity'), superAdminController.monitorUserActivity); // Monitor user activity
router.get('/monitor/traffic', superAdminAuthMiddleware, logActivityMiddleware('Monitor Server Traffic'), superAdminController.monitorServerTraffic); // Monitor server traffic

//Admin Monitoring
router.get('/monitor/admin', superAdminAuthMiddleware, logActivityMiddleware('Monitor Admin Activity'), superAdminController.monitorAdminActivity);

//Agent Monitoring
router.get('/monitor/agent', superAdminAuthMiddleware, logActivityMiddleware('Monitor Agent Activity'), superAdminController.monitorAgentActivity);

//Partner Monitoring
router.get('/monitor/partner', superAdminAuthMiddleware, logActivityMiddleware('Monitor Partner Activity'), superAdminController.monitorPartnerActivity);

// Logs
router.get('/logs', superAdminAuthMiddleware, logActivityMiddleware('View All Server Logs'), superAdminController.viewServerLogs); // View server logs

// Analytics Dashboard
router.get('/analytics/dashboard', superAdminAuthMiddleware, logActivityMiddleware('View Analytics Dashboard'), superAdminController.getAnalyticsDashboard); // Analytics dashboard

// Notifications
router.get('/notifications', superAdminAuthMiddleware, logActivityMiddleware('View Notifications'), superAdminController.getSystemNotifications); // View notifications
router.post('/notifications', superAdminAuthMiddleware, logActivityMiddleware('Create System Notification'), superAdminController.createSystemNotification); // Create notifications

// Backup
router.post('/backup/export', superAdminAuthMiddleware, logActivityMiddleware('Export Data for Backup'), superAdminController.exportData); // Export data for backup

// User Management
router.get('/user-management', superAdminAuthMiddleware, logActivityMiddleware('Fetch All Users'), superAdminController.getAllUsers); // Full user management
router.put('/user-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Update User'), superAdminController.updateUser); // Update user
router.delete('/user-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Delete User'), superAdminController.deleteUser); // Delete user
router.post('/user-management', superAdminAuthMiddleware, logActivityMiddleware('Create User'), superAdminController.createUser); // Create user

// Agent Management
router.get('/agent-management', superAdminAuthMiddleware, logActivityMiddleware('Fetch All Agents'), superAdminController.getAllAgents); // Fetch all agents
router.post('/agent-management', superAdminAuthMiddleware, logActivityMiddleware('Create Agent'), superAdminController.createAgent); // Create a new agent
router.put('/agent-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Update Agent'), superAdminController.updateAgent); // Update agent details
router.delete('/agent-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Delete Agent'), superAdminController.deleteAgent); // Delete an agent

// Admin Management
router.get('/admin-management', superAdminAuthMiddleware, logActivityMiddleware('Fetch All Admins'), superAdminController.getAllAdmins); // Fetch all admins
router.post('/admin-management', superAdminAuthMiddleware, logActivityMiddleware('Create Admin'), superAdminController.createAdmin); // Create a new admin
router.put('/admin-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Update Admin'), superAdminController.updateAdmin); // Update admin details
router.delete('/admin-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Delete Admin'), superAdminController.deleteAdmin); // Delete an admin

// Partner Management
router.get('/partner-management', superAdminAuthMiddleware, logActivityMiddleware('Fetch All Partners'), superAdminController.getAllPartners); // Fetch all partners
router.post('/partner-management', superAdminAuthMiddleware, logActivityMiddleware('Create Partner'), superAdminController.createPartner); // Create a new partner
router.put('/partner-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Update Partner'), superAdminController.updatePartner); // Update partner details
router.delete('/partner-management/:id', superAdminAuthMiddleware, logActivityMiddleware('Delete Partner'), superAdminController.deletePartner); // Delete a partner

module.exports = router;
