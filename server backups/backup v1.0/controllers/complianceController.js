const getComplianceReport = async (req, res) => {
    try {
      // Dummy report (replace with actual logic)
      const report = { compliance: true, lastUpdated: new Date() };
  
      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = { getComplianceReport };
  