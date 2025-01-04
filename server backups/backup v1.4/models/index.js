const User = require('./User/User');
const KYC = require('./User/KYC');
const Portfolio = require('./User/Portfolio');
const Transaction = require('./User/Transaction');
const Admin = require('./Admin/Admin');
const Logs = require('./Admin/Logs');
const Agent = require('./Agent/Agent');
const DailyActivity = require('./Agent/DailyActivity');
const Partner = require('./Partner/Partner');
const AgentPerformance = require('./Partner/AgentPerformance');
const MutualFund = require('./MutualFund/MutualFund');
const Recommendation = require('./MutualFund/Recommendation');
const Promotion = require('./Promotion/Promotion');
const Notification = require('./Notifications/Notification');
const News = require('./News/News');
const Query = require('./Support/Query');
const Faq = require('./Support/Faq');

module.exports = {
  User,
  KYC,
  Portfolio,
  Transaction,
  Admin,
  Logs,
  Agent,
  DailyActivity,
  Partner,
  AgentPerformance,
  MutualFund,
  Recommendation,
  Promotion,
  Notification,
  News,
  Query,
  Faq
};
