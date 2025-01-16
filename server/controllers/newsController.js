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
      audience: { $in: [audience, 'common'] },
      status: 'published',
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

// -------------> For User <------------- //
exports.getUserNews = async (req, res) => {
  try {
    const userRole = req.user.role; // Extract the user role from auth middleware

    // Fetch news targeted to the user and general audience
    const news = await News.find({
      audience: { $in: [userRole, 'common'] }, // Match user role or common news
      status: 'published', // Only include published news
    })
      .sort({ createdAt: -1 }) // Sort by latest news first
      .select('title content imageURL createdAt audience'); // Fetch only required fields

    res.status(200).json({
      message: 'News fetched successfully',
      news,
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role; // Extract user role from the auth middleware

    // Fetch the news item
    const news = await News.findById(id);

    // If the news item is not found
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check if the news is published
    if (news.status !== 'published') {
      return res.status(403).json({ message: 'Access denied. This news is not published.' });
    }

    // Check if the user is authorized to access this news
    if (news.audience !== 'common' && news.audience !== userRole) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to view this news.' });
    }

    // If authorized, return the news
    res.status(200).json({
      message: 'News fetched successfully',
      news,
    });
  } catch (error) {
    console.error('Error fetching specific news:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

