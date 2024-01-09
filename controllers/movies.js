const {Movie} = require('../models/movie');
const {
  ValidationError,
  NotFoundError,
} = require('../error-classes');

async function createMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN
    } = req.body;
    const owner = req.user._id;
    const movieNew = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN
    });
    await movieNew.populate('owner');
    res.status(201).send(movieNew);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  const {movieId} = req.params;
  return Movie.findById(movieId).populate('owner').populate('likes')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Ошибка! Такой фильм не найден');
      }
      return Movie.findByIdAndRemove(movieId).then(() => res.send({message: 'Фильм успешно удален'}));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Ошибка! Некорректные данные _id'));
        return;
      }
      next(err);
    });
}

async function getAllMovies(req, res, next) {
  try {
    const movies = await Movie.find({}).populate('owner');
    res.send(movies);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMovie,
  deleteMovie,
  getAllMovies
};
