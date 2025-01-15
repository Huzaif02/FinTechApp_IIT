// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const logActivity = require('../middleware/logActivityMiddleware');

const adminController = require('../controllers/adminController');
const agentController = require('../controllers/agentController');
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const partnerController = require('../controllers/partnerController')
const promotionController = require('../controllers/promotionController');
const newsController = require('../controllers/newsController');
const queryController = require('../controllers/queryController');
const faqController = require('../controllers/faqController');
const notificationController = require('../controllers/notificationController');

// Admin Registration
router.post('/register',logActivity('New Admin Register Request'), adminController.registerAdmin);

// Admin Login
router.post('/login', logActivity('Admin Login Request'),adminController.loginAdmin);

// User Management
router.get('/users', adminAuthMiddleware, logActivity('Fetch All Users'), userController.getAllUsers);
router.get('/users/:id', adminAuthMiddleware, logActivity('Fetch User Details'), userController.getUserDetails);
router.put('/users/:id/status', adminAuthMiddleware, logActivity('Update User Status'), userController.updateUserStatus);

// KYC Management
router.get('/kyc', adminAuthMiddleware, logActivity('Fetch All KYC Details'), userController.getAllUsersKYC); // Fetch all users with KYC details
router.get('/kyc/:id', adminAuthMiddleware, logActivity('Fetch Specific KYC Details'), userController.getKYCDetails); // Fetch specific user KYC details
router.get('/pendingkyc', adminAuthMiddleware, logActivity('Fetch Pending KYC Details'), userController.getPendingKYCs); // Fetch users with Pending KYC status
router.put('/kyc/:id', adminAuthMiddleware, logActivity('Update KYC Status'), userController.updateKYCStatus); // Update KYC status for a specific user

// Transaction Monitoring
router.get('/transactions', adminAuthMiddleware, logActivity('Fetch All Transactions'), transactionController.getAllTransactions);
router.get('/transactions/:id', adminAuthMiddleware, logActivity('Fetch Specific Transaction'), transactionController.getTransactionById);

// Agent Management
router.post('/agent/addagent', adminAuthMiddleware, logActivity('Add Agent'), agentController.addAgent);
router.get('/agent', adminAuthMiddleware, logActivity('Fetch All Agents'), agentController.getAllAgents); // Fetch all agents
router.get('/agent/:id', adminAuthMiddleware, logActivity('Fetch Agent Details'), agentController.getAgentDetails); // Fetch specific agent details
router.delete('/agent/:id', adminAuthMiddleware, logActivity('Remove Agent'), agentController.removeAgent); // Remove an agent
router.get('/agent/:id/progress', adminAuthMiddleware, logActivity('Monitor Agent Progress'), agentController.getAgentProgress); // Monitor agent progress
router.put('/agent/:id', adminAuthMiddleware, logActivity('Update Agent Details'), agentController.updateAgent); // Update agent details

// Admin Dashboard
router.get('/dashboard', adminAuthMiddleware, logActivity('Fetch Admin Dashboard Data'), adminController.getDashboardData);

// Partner Management
router.post('/partner', adminAuthMiddleware, logActivity('Add Partner'), partnerController.addPartner); // Add a new partner
router.get('/partner/reports', adminAuthMiddleware, logActivity('Fetch All Reports by Partner'), partnerController.getAllReports); //Fetching All Reports Submitted by Partners
router.get('/partner/reports/:id', adminAuthMiddleware, logActivity('Fetch Partner Report in Detail'), partnerController.getReportById); // Fetching Reports Submitted for specific Partners
router.get('/partner', adminAuthMiddleware, logActivity('Fetch All Partners'), partnerController.getAllPartners); // Fetch all partners
router.get('/partner/:id', adminAuthMiddleware, logActivity('Fetch Partner Details'), partnerController.getPartnerDetails); // Fetch specific partner details
router.put('/partner/:id', adminAuthMiddleware, logActivity('Update Partner Details'), partnerController.updatePartner); // Update partner details
router.delete('/partner/:id', adminAuthMiddleware, logActivity('Remove Partner'), partnerController.removePartner); // Remove a partner

// Promotion Management
router.post('/promotions', adminAuthMiddleware, logActivity('Create Promotion'), promotionController.createPromotion); // Create a new promotion
router.get('/promotions', adminAuthMiddleware, logActivity('Fetch All Promotions'), promotionController.getAllPromotions); // Fetch all promotions
router.get('/promotions/:id', adminAuthMiddleware, logActivity('Fetch Specific Promotion'), promotionController.getPromotionById); // Fetch a specific promotion
router.put('/promotions/:id', adminAuthMiddleware, logActivity('Update Promotion'), promotionController.updatePromotion); // Update a promotion
router.delete('/promotions/:id', adminAuthMiddleware, logActivity('Delete Promotion'), promotionController.deletePromotion); // Delete a promotion
router.get('/promotions/audience/:audience', adminAuthMiddleware, logActivity('Fetch Promotions for Specific Audience'), promotionController.getPromotionsForAudience); // Fetch promotions for a specific audience

// News Management
router.post('/news', adminAuthMiddleware, logActivity('Create News Post'), newsController.createNews); // Create a news post
router.get('/news', adminAuthMiddleware, logActivity('Fetch All News Posts'), newsController.getAllNews); // Fetch all news posts
router.get('/news/:id', adminAuthMiddleware, logActivity('Fetch Specific News Post'), newsController.getNewsById); // Fetch a specific news post
router.put('/news/:id', adminAuthMiddleware, logActivity('Update News Post'), newsController.updateNews); // Update a news post
router.delete('/news/:id', adminAuthMiddleware, logActivity('Delete News Post'), newsController.deleteNews); // Delete a news post
router.get('/news/audience/:audience', adminAuthMiddleware, logActivity('Fetch News for Specific Audience'), newsController.getNewsForAudience); // Fetch news for a specific audience

// Query Management
router.post('/queries', adminAuthMiddleware, logActivity('Create Query'), queryController.createQuery); // Create a query
router.get('/queries', adminAuthMiddleware, logActivity('Fetch All Queries for Admin'), queryController.getAllQueries); // Fetch queries for admin to answer
router.get('/queries/audience/:audience', adminAuthMiddleware, logActivity('Fetch Queries for Specific Audience'), queryController.getQueriesForAudience); // Fetch queries for a specific audience
router.put('/queries/:id/answer', adminAuthMiddleware, logActivity('Answer Query'), queryController.answerQuery); // Answer a query
router.post('/queries/bulk-create', adminAuthMiddleware, logActivity('Bulk Create Queries'), queryController.bulkCreateQueries); // Bulk Create Queries

// Notifications
router.post('/notifications', adminAuthMiddleware, logActivity('Create Notification'), notificationController.createNotification);
router.get('/notifications', adminAuthMiddleware, logActivity('Fetch All Notifications'), notificationController.getAllNotifications);
router.get('/notifications/:id', adminAuthMiddleware, logActivity('Fetch Specific Notification'), notificationController.getNotificationById);
router.delete('/notifications/:id', adminAuthMiddleware, logActivity('Delete Notification'), notificationController.deleteNotification);
router.get('/notifications/audience/:audience', adminAuthMiddleware, logActivity('Fetch Notifications for Specific Audience'), notificationController.getNotificationsForAudience);

// FAQ Management
router.post('/faqs', adminAuthMiddleware, logActivity('Create FAQ'), faqController.createFAQ); // Create an FAQ
router.get('/faqs/audience/:audience', adminAuthMiddleware, logActivity('Fetch FAQs for Specific Audience'), faqController.getFAQsForAudience); // Fetch FAQs for a specific audience
router.delete('/faqs/:id', adminAuthMiddleware, logActivity('Delete FAQ'), faqController.deleteFAQ); // Delete an FAQ
router.post('/faqs/bulk-create', adminAuthMiddleware, logActivity('Bulk Create FAQs'), faqController.bulkCreateFAQs); // Bulk Create FAQs

module.exports = router;