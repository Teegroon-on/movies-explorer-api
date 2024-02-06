// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');
const {
  NOT_FOUND_TEXT,
  BAD_REQUEST_TEXT,
  CONFLICT_ERROR_TEXT,
  UNAUTHORIZED_TEXT,
  OK_CODE,
  SALT,
} = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError(CONFLICT_ERROR_TEXT),
        );
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_TEXT);
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(BAD_REQUEST_TEXT),
        );
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(CONFLICT_ERROR_TEXT),
        );
      }
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_TEXT);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(UNAUTHORIZED_TEXT);
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return next(new UnauthorizedError(UNAUTHORIZED_TEXT));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          },
        );
        return res.status(OK_CODE).send({ token });
      });
    })
    .catch(next);
};
