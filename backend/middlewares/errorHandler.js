import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File is too large. Maximum size is 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Errors from fileFilter or other middleware
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
