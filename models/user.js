const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { MAIL_INCORRECT_TEXT } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: MAIL_INCORRECT_TEXT,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    select: false,
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });

module.exports = mongoose.model('user', userSchema);
