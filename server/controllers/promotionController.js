const Promotion = require('../models/Promotion/Promotion');

// Create a Promotion
exports.createPromotion = async (req, res) => {
  try {
    console.log("methood calledddddd");
    const { title, content, imageURL, targetAudience, publishDate, expirationDate, status } = req.body;
    console.log(req.user);
    // Create the promotion
    const promotion = await Promotion.create({
      title,
      content,
      imageURL,
      targetAudience,
      status,
      publishDate,
      expirationDate,
      createdBy: req.user.id, // Admin ID from auth middleware
    });

    res.status(201).json({
      message: 'Promotion created successfully',
      promotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch All Promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();

    res.status(200).json({
      message: 'Promotions fetched successfully',
      promotions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch Specific Promotion
exports.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({
      message: 'Promotion details fetched successfully',
      promotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a Promotion
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageURL, targetAudience, publishDate, expirationDate, status } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      id,
      { title, content, imageURL, targetAudience, publishDate, expirationDate, status },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({
      message: 'Promotion updated successfully',
      promotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a Promotion
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findByIdAndDelete(id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({
      message: 'Promotion deleted successfully',
      promotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message });
  }
};

// Fetch Promotions for a Specific Audience
exports.getPromotionsForAudience = async (req, res) => {
  try {
    const { audience } = req.params; // Audience: User, Agent, or Partner

    const promotions = await Promotion.find({
      targetAudience: audience,
      status: 'Published',
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: { $gte: new Date() } },
      ],
    });

    res.status(200).json({
      message: 'Promotions fetched successfully',
      promotions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};