const express = require('express');
const {celebrate, Joi} = require('celebrate');
const {
  createMovie,
  deleteMovie,
  getAllMovies
} = require('../controllers/movies');

const paramsValidationConfig = {
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
};

const movies = express.Router();

movies.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      trailerLink: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      owner: Joi.string().length(24).hex().required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

movies.delete('/:_id', celebrate(paramsValidationConfig), deleteMovie);

movies.get('/', getAllMovies);

module.exports = {movies};
