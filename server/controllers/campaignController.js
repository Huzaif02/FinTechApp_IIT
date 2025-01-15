const Campaign = require('../models/Partner/Campaign');
const CampaignInteraction = require('../models/Partner/CampaignInteraction');

// View all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    res.status(200).json({ message: 'Campaigns fetched successfully', campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View a specific campaign
exports.getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({ _id: id, createdBy: req.user.id });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign fetched successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, imageURL, targetAudience, startDate, endDate } = req.body;

    const campaign = await Campaign.create({
      createdBy: req.user.id,
      title,
      description,
      imageURL,
      targetAudience,
      startDate,
      endDate,
    });

    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageURL, targetAudience, startDate, endDate, status } = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { title, description, imageURL, targetAudience, startDate, endDate, status },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or not authorized to update' });
    }

    res.status(200).json({ message: 'Campaign updated successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findOneAndDelete({ _id: id, createdBy: req.user.id });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Campaign deleted successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Track campaign views
exports.trackView = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment the views count
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { $inc: { 'metrics.views': 1 } },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Log the interaction
    await CampaignInteraction.create({
      campaignId: id,
      userId: req.user.id,
      interactionType: 'view',
    });

    res.status(200).json({ message: 'View tracked successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Track campaign clicks
exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment the clicks count
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { $inc: { 'metrics.clicks': 1 } },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update engagement rate
    const engagementRate = (campaign.metrics.clicks / campaign.metrics.views) * 100;
    campaign.metrics.engagementRate = engagementRate;
    await campaign.save();

    // Log the interaction
    await CampaignInteraction.create({
      campaignId: id,
      userId: req.user.id,
      interactionType: 'click',
    });

    res.status(200).json({ message: 'Click tracked successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get campaign analytics
exports.getCampaignAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Fetch detailed interaction logs
    const interactionLogs = await CampaignInteraction.find({ campaignId: id }).populate(
      'userId',
      'fullName email'
    );

    res.status(200).json({
      message: 'Campaign analytics fetched successfully',
      metrics: campaign.metrics,
      interactionLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
