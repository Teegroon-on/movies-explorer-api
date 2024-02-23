const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../httpStatus/unauthorized');
const { UNAUTHORIZED_TEXT } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED_TEXT);
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_TEXT));
  }
  req.user = payload;
  return next();
};
