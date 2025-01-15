// News Controller
const News = require('../models/News/News');

// Create a News Post
exports.createNews = async (req, res) => {
  try {
    const { title, content, imageURL, category, audience, publishDate, status } = req.body;

    // Create the news post
    const news = await News.create({
      title,
      content,
      imageURL,
      category,
      audience,
      status,
      publishDate,
      createdBy: req.user.id, // Admin ID from auth middleware
    });

    res.status(201).json({
      message: 'News created successfully',
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch All News Posts
exports.getAllNews = async (req, res) => {
  try {
    const newsPosts = await News.find();

    res.status(200).json({
      message: 'News posts fetched successfully',
      newsPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch Specific News Post
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({
      message: 'News details fetched successfully',
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a News Post
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageURL, category, audience, publishDate, status } = req.body;

    const news = await News.findByIdAndUpdate(
      id,
      { title, content, imageURL, category, audience, publishDate, status },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({
      message: 'News updated successfully',
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a News Post
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({
      message: 'News deleted successfully',
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message });
  }
};

// Fetch News for a Specific Audience
exports.getNewsForAudience = async (req, res) => {
  try {
    const { audience } = req.params; // Audience: User, Agent, Partner, or All

    const newsPosts = await News.find({
      audience: { $in: [audience, 'All'] },
      status: 'Published',
      $or: [
        { publishDate: { $exists: false } },
        { publishDate: { $lte: new Date() } },
      ],
    });

    res.status(200).json({
      message: 'News posts fetched successfully',
      newsPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
