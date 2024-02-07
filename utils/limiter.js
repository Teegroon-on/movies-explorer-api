const rateLimit = require('express-rate-limit');
const { LIMIT_TEXT } = require('./constants');

const limiter = rateLimit({
  windowMs: 1440 * 60 * 1000,
  max: 500,
  message: LIMIT_TEXT,
});

module.exports = limiter;
