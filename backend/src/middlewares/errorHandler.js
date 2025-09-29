const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: `Duplicate value for ${field}. Please use a unique value.`,
    });
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  // MongoDB CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // MongoDB Connection Error
  if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
    return res.status(503).json({
      error: 'Database connection error. Please try again later.',
    });
  }

  // Generic error
  res.status(500).json({
    // error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};

module.exports = errorHandler;