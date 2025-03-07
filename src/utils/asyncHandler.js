const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    error.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export {asyncHandler};