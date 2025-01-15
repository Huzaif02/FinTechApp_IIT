const express = require('express');
const router = express.Router();

// Import Middleware
const partnerAuthMiddleware = require('../middleware/partnerAuthMiddleware');
const logActivityMiddleware = require('../middleware/logActivityMiddleware');

// Import Controllers
const partnerController = require('../controllers/partnerController');
const agentController = require('../controllers/agentController');
const queryController = require('../controllers/queryController');
const campaignController = require('../controllers/campaignController');
const analyticsController = require('../controllers/analyticsController');
const notificationController = require('../controllers/notificationController');

// Routes
router.post('/login', logActivityMiddleware('Partner Login Request'), partnerController.partnerLogin); // Login
router.get('/profile', partnerAuthMiddleware, logActivityMiddleware('Partner Viewing Profile'), partnerController.getPartnerDetails); // View Profile
router.put('/profile', partnerAuthMiddleware, logActivityMiddleware('Partner Updating Profile'), partnerController.updatePartner); // Update Profile
// router.post('/logout', partnerAuthMiddleware, logActivityMiddleware('Partner Logout Request')); // Logout

// Partner Dashboard
router.get('/dashboard', partnerAuthMiddleware, logActivityMiddleware('View Partner Dashboard'), partnerController.getDashboard); // Dashboard Overview

// Agent Management ( all routes working )
router.get('/agents', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching All Their Agents'), agentController.getAllAgents); // Fetch all agents  
router.post('/agents', partnerAuthMiddleware, logActivityMiddleware('Partner Creating Agent'), agentController.addAgent); // Add a new agent
router.put('/agents/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Updating Agent'), agentController.updateAgent); // Update agent details
router.get('/agents/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Agent by ID'), agentController.getAgentDetails); // Fetch agent with id
router.delete('/agents/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Deleting Agent'), agentController.removeAgent); // Remove an agent

// Support and Query Management (all routes working)
router.get('/queries', partnerAuthMiddleware, logActivityMiddleware('Partner Viewing Queries'), queryController.getQueriesForAudience); // View queries
router.post('/queries', partnerAuthMiddleware, logActivityMiddleware('Partner Creating Query'), queryController.createQuery); // Create a query
router.put('/queries/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Answering Query'), queryController.answerQuery); // Update a query

//Campaign Management (all routes working)
router.get('/campaigns', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Campaigns'), campaignController.getAllCampaigns);// View all campaigns
router.get('/campaigns/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Specific Campaign'), campaignController.getCampaignById);// View a specific campaign
router.post('/campaigns', partnerAuthMiddleware, logActivityMiddleware('Partner Creating Campaign'), campaignController.createCampaign);// Create a campaign
router.put('/campaigns/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Updating Campaign'), campaignController.updateCampaign);// Update a campaign
router.delete('/campaigns/:id', partnerAuthMiddleware, logActivityMiddleware('Partner Deleting Campaign'), campaignController.deleteCampaign);// Delete a campaign
router.post('/campaigns/:id/view', partnerAuthMiddleware, logActivityMiddleware('Partner Tracking Campaign View'), campaignController.trackView);// Track campaign views
router.post('/campaigns/:id/click', partnerAuthMiddleware, logActivityMiddleware('Partner Tracking Campaign Click'), campaignController.trackClick);// Track campaign clicks
router.get('/campaigns/:id/analytics', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Campaign Analytics'), campaignController.getCampaignAnalytics); // Get campaign analytics

//Analytics Endpoint Management (All routes working)
router.get('/analytics', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Analytics'), analyticsController.getAnalytics);// Fetch overall analytics
router.get('/analytics/campaigns', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Campaign Analytics'), analyticsController.getCampaignAnalytics);// Fetch campaign analytics
router.get('/analytics/agents', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Agent Analytics'), analyticsController.getAgentAnalytics);// Fetch agent analytics
router.post('/analytics/report', partnerAuthMiddleware, logActivityMiddleware('Partner Submitting Analytics Report'), analyticsController.submitReport);// Submit analytics report
router.post('/analytics/export', partnerAuthMiddleware, logActivityMiddleware('Partner Exporting Analytics Data'), analyticsController.exportAnalytics);// Export analytics data

// Notifications
router.get('/notifications', partnerAuthMiddleware, logActivityMiddleware('Partner Fetching Notifications'), notificationController.getNotifications); // Fetch all notifications

module.exports = router;




// getAgentDetails

// removeAgent

// getAgentProgress

//listing of applicable routes

// const express = require('express');
// const router = express.Router();

// // Import Middleware
// const partnerAuthMiddleware = require('../middleware/partnerAuthMiddleware');
// const sessionMiddleware = require('../middleware/sessionMiddleware');
// const loggingMiddleware = require('../middleware/loggingMiddleware');

// // Import Controllers
// const partnerController = require('../controllers/partnerController');
// const agentManagementController = require('../controllers/agentManagementController');
// const campaignController = require('../controllers/campaignController');
// const engagementController = require('../controllers/engagementController');
// const analyticsController = require('../controllers/analyticsController');
// const queryController = require('../controllers/queryController');
// const notificationController = require('../controllers/notificationController');

// // Partner Login and Account Management
// router.post('/login', loggingMiddleware('Partner Login'), partnerController.loginPartner); // Login
// router.get('/profile', partnerAuthMiddleware, partnerController.getProfile); // View Profile
// router.put('/profile', partnerAuthMiddleware, partnerController.updateProfile); // Update Profile
// router.post('/logout', partnerAuthMiddleware, sessionMiddleware, partnerController.logoutPartner); // Logout

// // Partner Dashboard
// router.get('/dashboard', partnerAuthMiddleware, loggingMiddleware('View Partner Dashboard'), partnerController.getDashboard); // Dashboard Overview

// // Agent Management
// router.get('/agents', partnerAuthMiddleware, loggingMiddleware('Fetch Partner Agents'), agentManagementController.getAllAgents); // Fetch all agents
// router.post('/agents', partnerAuthMiddleware, loggingMiddleware('Create Partner Agent'), agentManagementController.createAgent); // Add a new agent
// router.put('/agents/:id', partnerAuthMiddleware, loggingMiddleware('Update Partner Agent'), agentManagementController.updateAgent); // Update agent details
// router.delete('/agents/:id', partnerAuthMiddleware, loggingMiddleware('Delete Partner Agent'), agentManagementController.deleteAgent); // Remove an agent

// // Campaign Management
// router.get('/campaigns', partnerAuthMiddleware, loggingMiddleware('Fetch Campaigns'), campaignController.getAllCampaigns); // View all campaigns
// router.post('/campaigns', partnerAuthMiddleware, loggingMiddleware('Create Campaign'), campaignController.createCampaign); // Create a campaign
// router.put('/campaigns/:id', partnerAuthMiddleware, loggingMiddleware('Update Campaign'), campaignController.updateCampaign); // Update a campaign
// router.delete('/campaigns/:id', partnerAuthMiddleware, loggingMiddleware('Delete Campaign'), campaignController.deleteCampaign); // Delete a campaign

// // User Engagement
// router.get('/engagement/users', partnerAuthMiddleware, loggingMiddleware('Fetch Engaged Users'), engagementController.getEngagedUsers); // Fetch engaged users
// router.post('/engagement/users/:id', partnerAuthMiddleware, loggingMiddleware('Engage with User'), engagementController.engageWithUser); // Engage with a specific user

// Analytics and Reports
// router.get('/analytics', partnerAuthMiddleware, loggingMiddleware('Fetch Partner Analytics'), analyticsController.getAnalytics); // View analytics
// router.post('/analytics/report', partnerAuthMiddleware, loggingMiddleware('Submit Partner Report'), analyticsController.submitReport); // Submit report to admin/super admin

// // Communication Channel
// router.get('/communication', partnerAuthMiddleware, loggingMiddleware('View Communication Channels'), partnerController.getCommunicationChannels); // Get communication channels
// router.post('/communication', partnerAuthMiddleware, loggingMiddleware('Send Communication'), partnerController.sendCommunication); // Send communication

// // Support and Query Management
// router.get('/queries', partnerAuthMiddleware, loggingMiddleware('View Partner Queries'), queryController.getPartnerQueries); // View queries
// router.post('/queries', partnerAuthMiddleware, loggingMiddleware('Create Query'), queryController.createQuery); // Create a query
// router.put('/queries/:id', partnerAuthMiddleware, loggingMiddleware('Update Query'), queryController.updateQuery); // Update a query

// // Notifications
// router.get('/notifications', partnerAuthMiddleware, loggingMiddleware('View Partner Notifications'), notificationController.getNotifications); // Fetch all notifications

// module.exports = router;
