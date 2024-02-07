const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../httpStatus/unauthorized');
const { UNAUTHORIZED_TEXT } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(UNAUTHORIZED_TEXT);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_TEXT));
  }
  req.user = payload;
  return next();
};
