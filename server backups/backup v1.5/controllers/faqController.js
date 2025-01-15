const FAQ = require('../models/Support/Faq');

// Create an FAQ
exports.createFAQ = async (req, res) => {
    try {
      const { question, answer, category } = req.body;
  
      const faq = await FAQ.create({ question, answer, category });
  
      res.status(201).json({
        message: 'FAQ created successfully',
        faq,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };
  
  // Fetch FAQs for a Specific Audience
  exports.getFAQsForAudience = async (req, res) => {
    try {
      const { audience } = req.params; // Audience: User, Agent, Partner, or Common
      
      // Use a case-insensitive regex query for audience and 'Common'
        const faqs = await FAQ.find({
        category: {
          $in: [new RegExp(`^${audience}$`, 'i'), 'Common'], // Regex makes it case-insensitive
        },
        });

      res.status(200).json({
        message: 'FAQs fetched successfully',
        faqs,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  };
  
  // Delete an FAQ
  exports.deleteFAQ = async (req, res) => {
    try {
      const { id } = req.params;
  
      const faq = await FAQ.findByIdAndDelete(id);
  
      if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
  
      res.status(200).json({
        message: 'FAQ deleted successfully',
        faq,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message });
    }
  };

  exports.bulkCreateFAQs = async (req, res) => {
    try {
      const { faqs } = req.body;
  
      if (!faqs || !Array.isArray(faqs)) {
        return res.status(400).json({ message: "Invalid input. FAQs must be an array." });
      }
  
      const createdFAQs = await FAQ.insertMany(faqs);
  
      res.status(201).json({
        message: "FAQs created successfully",
        faqs: createdFAQs,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };
  