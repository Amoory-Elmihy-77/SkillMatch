const logger = require("../utils/logger");

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const status = err.isOperational ? "fail" : "error";

  if (!err.isOperational) {
    logger.error(`UNHANDLED ERROR: ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      ip: req.ip,
    });
  }

  res.status(statusCode).json({
    status: status,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
