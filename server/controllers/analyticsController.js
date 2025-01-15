const Campaign = require('../models/Partner/Campaign');
const Agent = require('../models/Agent/Agent');
const Engagement = require('../models/Partner/Engagement');
const Transaction = require('../models/User/Transaction');
const PartnerReport = require('../models/Partner/PartnerReport');

// Fetch overall analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { id: partnerId } = req.user;

    const revenueTrends = await Transaction.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalCampaigns = await Campaign.countDocuments({ createdBy: partnerId });
    const totalAgents = await Agent.countDocuments({ assignedPartner: partnerId });
    const engagementData = await Engagement.aggregate([
      { $match: { partnerId } },
      { $group: { _id: '$engagementType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      message: 'Analytics fetched successfully',
      data: {
        revenueTrends,
        totalCampaigns,
        totalAgents,
        engagementData,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch campaign analytics
exports.getCampaignAnalytics = async (req, res) => {
  try {
    const { id: partnerId } = req.user;

    const campaigns = await Campaign.find({ createdBy: partnerId }).select('title metrics');
    res.status(200).json({
      message: 'Campaign analytics fetched successfully',
      campaigns,
    });
  } catch (error) {
    console.error('Error fetching campaign analytics:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch agent analytics
exports.getAgentAnalytics = async (req, res) => {
  try {
    const { id: partnerId } = req.user;

    const agents = await Agent.aggregate([
      { $match: { assignedPartner: partnerId } },
      {
        $lookup: {
          from: 'dailyactivities',
          localField: '_id',
          foreignField: 'agentId',
          as: 'tasks',
        },
      },
      {
        $project: {
          fullName: 1,
          completedTasks: {
            $size: {
              $filter: { input: '$tasks', as: 'task', cond: { $eq: ['$$task.status', 'Completed'] } },
            },
          },
          totalTasks: { $size: '$tasks' },
        },
      },
    ]);

    res.status(200).json({
      message: 'Agent analytics fetched successfully',
      agents,
    });
  } catch (error) {
    console.error('Error fetching agent analytics:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a Partner Report
exports.submitReport = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: partnerId } = req.user;

    // Fetch analytics data
    const revenueTrends = await Transaction.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalCampaigns = await Campaign.countDocuments({ createdBy: partnerId });
    const totalAgents = await Agent.countDocuments({ assignedPartner: partnerId });
    const engagementData = await Engagement.aggregate([
      { $match: { partnerId } },
      { $group: { _id: '$engagementType', count: { $sum: 1 } } },
    ]);

    // Create the report
    const report = await PartnerReport.create({
      partnerId,
      title,
      description,
      analytics: {
        revenueTrends,
        totalCampaigns,
        totalAgents,
        engagementData,
      },
      submittedAt: new Date(),
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    console.error('Error submitting report:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export analytics data
exports.exportAnalytics = async (req, res) => {
  try {
    const { id: partnerId } = req.user;

    const revenueTrends = await Transaction.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const campaigns = await Campaign.find({ createdBy: partnerId }).select('title metrics');
    const agents = await Agent.find({ assignedPartner: partnerId }).select('fullName');

    const analyticsData = { revenueTrends, campaigns, agents };

    // Convert analytics data to JSON and send as a downloadable file
    const fileName = `analytics-${Date.now()}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(JSON.stringify(analyticsData, null, 2));
  } catch (error) {
    console.error('Error exporting analytics:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
