export const errorHandler = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status).json({ success: false, msg: error.message });
  }
  res.status(500).json({ success: false, msg: "Server error" });
};
