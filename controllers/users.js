const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const { User } = require('../models/user');
const {
  ValidationError,
  UnauthorizedError,
  ConflictError,
} = require('../error-classes');

const SALT_LENGTH = 10;

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Ошибка! Неверные данные для входа');
    }
    const hasRightPassword = await bcrypt.compare(password, user.password);
    if (!hasRightPassword) {
      throw new UnauthorizedError('Ошибка! Неверные данные для входа');
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret',
      {
        expiresIn: '7d',
      },
    );
    res.send({ token });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка! Неверные данные в запросе'));
      return;
    }
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);
    let user = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`Ошибка! Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Ошибка! Пользователь с таким email уже существует'));
      return;
    }
    next(err);
  }
}

module.exports = {
  getCurrentUser,
  login,
  updateUser,
  createUser,
};
