const Query = require('../models/Support/Query');

// Create a Query
exports.createQuery = async (req, res) => {
    try {
      const { title, description, category } = req.body;
  
      const query = await Query.create({
        title,
        description,
        category,
        askedBy: req.user.id, // User/Agent/Partner ID from auth middleware
      });
  
      res.status(201).json({
        message: 'Query created successfully',
        query,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };
  
  // Fetch Queries for Admin to Answer
  exports.getQueriesForAdmin = async (req, res) => {
    try {
      const queries = await Query.find().populate('askedBy', 'fullName email');
  
      res.status(200).json({
        message: 'Queries fetched successfully',
        queries,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };
  
  // Answer a Query
  exports.answerQuery = async (req, res) => {
    try {
      const { id } = req.params;
      const { answer } = req.body;
  
      const query = await Query.findByIdAndUpdate(
        id,
        { answer, answeredBy: req.user.id, status: 'Resolved' },
        { new: true }
      );
  
      if (!query) {
        return res.status(404).json({ message: 'Query not found' });
      }
  
      res.status(200).json({
        message: 'Query answered successfully',
        query,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };

// Fetch Queries for a Specific Audience
exports.getQueriesForAudience = async (req, res) => {
    try {
      const { audience } = req.params; // Audience: User, Agent, Partner, or Common
  
      // Query with case-insensitive regex and "Common" fallback
      const queries = await Query.find({
        category: { $in: [new RegExp(`^${audience}$`, 'i'), 'Common'] },
      });
  
      res.status(200).json({
        message: 'Queries fetched successfully',
        queries,
      });
    } catch (error) {
      console.error('Error fetching queries:', error.message);
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };
  

  // Bulk Create Queries
exports.bulkCreateQueries = async (req, res) => {
    try {
      const { queries } = req.body;
  
      if (!queries || !Array.isArray(queries)) {
        return res.status(400).json({ message: "Invalid input. Queries must be an array." });
      }
  
      const createdQueries = await Query.insertMany(
        queries.map(query => ({
          ...query,
          askedBy: req.user.id // Add the user ID for all queries
        }))
      );
  
      res.status(201).json({
        message: "Queries created successfully",
        queries: createdQueries,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };
  