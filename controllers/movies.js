const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const {
  BAD_REQUEST_TEXT,
  NOT_FOUND_TEXT,
  FORBIDDEN_URL_TEXT,
} = require('../utils/constants');

const Movie = require('../models/movie');

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_TEXT));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.userId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_TEXT);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(FORBIDDEN_URL_TEXT);
      }
      return movie.remove().then(() => res.send({ movie }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      return next(err);
    });
};
