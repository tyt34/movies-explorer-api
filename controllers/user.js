const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ValidationError = require('../errors/validation-error');
const WrongKeys = require('../errors/wrong-keys');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new CastError());
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  console.log(' update ');
  const { name, email } = req.body;
  if ((name === undefined) && (email === undefined)) {
    throw new WrongKeys();
  }
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
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
      console.log(' -> -> ');
      console.log(user)
      return user
    })
    .then((user) => {
      console.log(' -> ');
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') next(new ValidationError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};
