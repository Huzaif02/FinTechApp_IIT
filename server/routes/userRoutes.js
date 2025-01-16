const express = require('express');
const router = express.Router();

//Middlewares
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const logActivityMiddleware = require('../middleware/logActivityMiddleware');

const { validateSession } = require('../middleware/sessionMiddleware'); // New session middleware

// Import Controllers
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController');
const portfolioController = require('../controllers/portfolioController');
const notificationController = require('../controllers/notificationController');
const transactionController = require('../controllers/transactionController');
const newsController = require('../controllers/newsController');
const promotionController = require('../controllers/promotionController');

// User Account Registration and Login
router.post('/pre-register', userController.preRegister);// Pre-Registration (Step 1) //ready
router.post('/verify-otp-register', userController.verifyOtpAndRegister); // Verify OTP and Register (Step 2) //ready
router.post('/resend-otp', userController.resendOtp); // Resend OTP //ready
router.post('/login', userController.loginUser); // Login Endpoint //ready

//User Account Management
router.put('/profile',userAuthMiddleware,validateSession,logActivityMiddleware('User Updating Profile'), userController.updateUserDetails); // Update Profile //ready
router.put('/password', userAuthMiddleware, validateSession, logActivityMiddleware('User Changing Password'), userController.changeUserPassword); // Change Password //ready
router.post('/logout',userAuthMiddleware, validateSession, logActivityMiddleware('User Logout'),userController.logoutUser); // User Logout //ready
router.get('/profile',userAuthMiddleware, validateSession, logActivityMiddleware('User Viewing Profile'),userController.getUserProfile); // Get User Profile //ready

// User Dashboard Routes
router.get('/dashboard', userAuthMiddleware, validateSession, logActivityMiddleware('User Viewing Dashboard'), dashboardController.getUserDashboard); // Fetch User Dashboard //ready
router.get('/dashboard/portfolio', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Portfolio Summary'), portfolioController.getPortfolio); // Fetch Portfolio Summary //ready
router.get('/dashboard/notifications', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Notifications'), notificationController.getNotifications); // Fetch Notifications //ready

//Recent Transactions
router.get('/transactions', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching All Transactions'), transactionController.getUsersTransactions); // Fetch All Transactions //ready
router.get('/transactions/recent', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Recent Transactions'), transactionController.getUsersRecentTransactions); // Fetch Transactions //ready

// News Routes
router.get('/news', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching News'), newsController.getUserNews); // Fetch all news for the user  //ready
router.get('/news/:id', userAuthMiddleware, validateSession, logActivityMiddleware('User Viewing Specific News'), newsController.getNewsById); // Fetch specific news //ready

// Promotions Routes
router.get('/promotions', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Promotions'), promotionController.getUserPromotions); // Fetch all promotions for the user
router.get('/promotions/:id', userAuthMiddleware, validateSession, logActivityMiddleware('User Viewing Specific Promotion'), promotionController.getPromotionById); // Fetch specific promotion

// Portfolio Routes
router.get('/portfolio', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Portfolio Details'), portfolioController.getPortfolioDetails); // Fetch user's portfolio details
router.post('/portfolio/add', userAuthMiddleware, validateSession, logActivityMiddleware('User Adding Investment to Portfolio'), portfolioController.addInvestmentToPortfolio); // Add investment to portfolio
router.put('/portfolio/update/:investmentId', userAuthMiddleware, validateSession, logActivityMiddleware('User Updating Investment in Portfolio'), portfolioController.updateInvestmentInPortfolio); // Update an existing investment in the portfolio
router.delete('/portfolio/remove/:investmentId', userAuthMiddleware, validateSession, logActivityMiddleware('User Removing Investment from Portfolio'), portfolioController.removeInvestmentFromPortfolio); // Remove an investment from the portfolio
router.get('/portfolio/performance', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Portfolio Performance'), portfolioController.getPortfolioPerformance); // Fetch overall portfolio performance
router.get('/portfolio/transactions', userAuthMiddleware, validateSession, logActivityMiddleware('User Fetching Portfolio Transactions'), portfolioController.getPortfolioTransactions); // Fetch portfolio-related transactions

module.exports = router;