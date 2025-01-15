const Query = require('../models/Support/Query');

// **1. Create a Query**
exports.createQuery = async (req, res) => {
  try {
    const { title, description, category: providedCategory } = req.body;
    const { role, id: requesterId } = req.user; // Extract role and ID from auth middleware

    let category;

    // Assign category automatically based on the role of the creator
    if (role === 'user') {
      category = 'User';
    } else if (role === 'partner') {
      category = 'Partner';
    } else if (role === 'agent') {
      category = 'Agent';
    } else if (role === 'admin' || role === 'super_admin') {
      // Admin/Super Admin must specify the category explicitly
      if (!providedCategory) {
        return res.status(400).json({ message: 'Category is required when admin or super admin creates a query.' });
      }
      category = providedCategory;
    } else {
      // Unauthorized role
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    // Create the query
    const query = await Query.create({
      title,
      description,
      category,
      askedBy: requesterId, // Save ID of the user creating the query
    });

    res.status(201).json({
      message: 'Query created successfully',
      query,
    });
  } catch (error) {
    console.error('Error creating query:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// **2. Answer a Query**
exports.answerQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const { role } = req.user; // Extract user role

    // Check role-based permissions for answering queries
    if (role === 'user') {
      return res.status(403).json({ message: 'Users are not authorized to answer queries.' });
    } else if (role === 'agent') {
      // Agents can only answer queries for Users and other Agents
      const query = await Query.findById(id);
      if (!query || !['User', 'Agent'].includes(query.category)) {
        return res.status(403).json({ message: 'Agents can only answer queries for Users or other Agents.' });
      }
    } else if (role === 'partner') {
      // Partners can answer queries for Users, Agents, and other Partners
      const query = await Query.findById(id);
      if (!query || !['User', 'Agent', 'Partner'].includes(query.category)) {
        return res.status(403).json({ message: 'Partners can only answer queries for Users, Agents, or other Partners.' });
      }
    }

    // Update the query with the answer
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
    console.error('Error answering query:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// **3. Fetch All Queries (Admin and Super Admin)**
exports.getAllQueries = async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Only admins can fetch all queries.' });
    }

    const queries = await Query.find().populate('askedBy', 'fullName email');

    res.status(200).json({
      message: 'Queries fetched successfully',
      queries,
    });
  } catch (error) {
    console.error('Error fetching all queries:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// **4. Fetch Queries for Specific Audience**
exports.getQueriesForAudience = async (req, res) => {
  try {
    const { role } = req.user;

    let audience;
    if (role === 'user') {
      audience = ['User', 'Common'];
    } else if (role === 'agent') {
      audience = ['User', 'Agent', 'Common'];
    } else if (role === 'partner') {
      audience = ['User', 'Agent', 'Partner', 'Common'];
    } else if (role === 'admin' || role === 'super_admin') {
      audience = ['User', 'Agent', 'Partner', 'Common'];
    } else {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    const queries = await Query.find({
      category: { $in: audience }, // Match categories based on role
    });

    res.status(200).json({
      message: 'Queries fetched successfully',
      queries,
    });
  } catch (error) {
    console.error('Error fetching queries for audience:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// **5. Bulk Create Queries**
exports.bulkCreateQueries = async (req, res) => {
  try {
    const { queries } = req.body;

    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({ message: 'Invalid input. Queries must be an array.' });
    }

    const createdQueries = await Query.insertMany(
      queries.map((query) => ({
        ...query,
        askedBy: req.user.id, // Add the user ID for all queries
        category: req.user.role === 'admin' || req.user.role === 'super_admin' ? query.category : req.user.role, // Assign category automatically for non-admins
      }))
    );

    res.status(201).json({
      message: 'Queries created successfully',
      queries: createdQueries,
    });
  } catch (error) {
    console.error('Error bulk creating queries:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
