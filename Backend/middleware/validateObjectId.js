const mongoose = require('mongoose');

// Middleware to validate MongoDB ObjectId in params
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }
  
  next();
};

module.exports = validateObjectId;
