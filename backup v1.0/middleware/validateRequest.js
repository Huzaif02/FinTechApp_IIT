const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        type: err.param ? 'field' : 'general',
        msg: err.msg,
        path: err.param || null,
        location: err.location || 'body',
      })),
    });
  }
  next();
};

module.exports = validateRequest;
