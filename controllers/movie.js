const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send({ data: movies });
    })
    .catch(next);
};

module.exports.delMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .orFail(() => new NotFoundError())
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError());
      } else {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(
        {
          data,
          owner: req.user._id,
        },
      );
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError(err.message));
      next(err);
    });
};
