// Error handling middleware to catch and respond to errors
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }
  res.status(err.status || 500).json({
      error: {
          message: err.message || 'An unexpected error occurred.',
          status: err.status || 500,
          timestamp: new Date()
      }
  });
};

module.exports = errorHandler;
