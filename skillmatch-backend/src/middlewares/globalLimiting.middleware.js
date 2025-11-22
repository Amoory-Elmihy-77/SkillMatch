const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  max: 10,
  windowMs: 5 * 60 * 1000,
  message: "Too many attempts from this IP, please try again after 5 minutes!",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter, authLimiter };
