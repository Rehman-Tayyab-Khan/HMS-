// Query Optimization Middleware
// Adds default pagination, sorting, and field selection to requests

const queryOptimizer = (req, res, next) => {
  // Default pagination
  req.pagination = {
    page: Math.max(1, parseInt(req.query.page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 20)),
    sort: req.query.sort || '-createdAt'
  };

  req.pagination.skip = (req.pagination.page - 1) * req.pagination.limit;

  // Field selection (exclude sensitive fields by default)
  req.select = req.query.select || '-__v -password';

  // Enable lean mode for better performance (unless explicitly disabled)
  req.lean = req.query.lean !== 'false';

  next();
};

module.exports = queryOptimizer;
