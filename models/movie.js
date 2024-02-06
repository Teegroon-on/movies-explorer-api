const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const { LINK_INCORRECT_TEXT } = require('../utils/constants');

const movieSchema = new mongoose.Schema({

  country: {
    type: String,
    require: true,
  },

  director: {
    type: String,
    require: true,
  },

  duration: {
    type: Number,
    require: true,
  },

  year: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    require: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isUrl(url),
      message: LINK_INCORRECT_TEXT,
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isUrl(url),
      message: LINK_INCORRECT_TEXT,
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isUrl(url),
      message: LINK_INCORRECT_TEXT,
    },
  },

  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  movieId: {
    type: Number,
    required: true,
    ref: 'user',
  },
});

module.exports = mongoose.model('movie', movieSchema);
