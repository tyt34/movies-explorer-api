const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ValidationError = require('../errors/validation-error');
const WrongKeys = require('../errors/wrong-keys');
const RepeatEmail = require('../errors/repeat-email');
const NotNewInfo = require('../errors/not-new-info');

function updateNewInfo(name, email, id, res, next) {
  User.findByIdAndUpdate(
    {
      _id: id,
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
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}

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
  const { name, email } = req.body;
  if ((name === undefined) && (email === undefined)) {
    throw new WrongKeys();
  }
  User.findOne({ email })
    .then((info) => {
      if (info === null) {
        updateNewInfo(name, email, req.user._id, res, next);
      } else {
        /*
        if ((req.user._id !== info._id.toString())) {
          next(new RepeatEmail());
        } else {
          if ((info.name === name) && (info.email === email)) {
            throw new NotNewInfo();
          } else if (info.email === email) {
            updateNewInfo(name, email, req.user._id, res, next);
          } else {
            next(new RepeatEmail());
          }
        }
        */
        if (req.user._id !== info._id.toString()) {
          next(new RepeatEmail());
        } else if ((info.name === name) && (info.email === email)) {
          throw new NotNewInfo();
        } else if (info.email === email) {
          updateNewInfo(name, email, req.user._id, res, next);
        } else {
          next(new RepeatEmail());
        }
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};
