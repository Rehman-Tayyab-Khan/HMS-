// Add request ID to each request for tracking
const requestId = (req, res, next) => {
  // Generate simple request ID if uuid is not available
  req.id = req.headers['x-request-id'] || 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  res.setHeader('X-Request-ID', req.id);
  next();
};

module.exports = requestId;
