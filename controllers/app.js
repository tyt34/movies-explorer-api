const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ValidationError = require('../errors/validation-error');
const WrongPass = require('../errors/wrong-pass');
const RepeatEmail = require('../errors/repeat-email');
const WrongKeys = require('../errors/wrong-keys');
const { jwtNotSecret } = require('../configBackend');

let soup;

if (process.env.NODE_ENV === 'production') {
  soup = process.env.JWT_SECRET;
} else {
  soup = jwtNotSecret;
}

module.exports.register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if ((email === undefined) || (password === undefined) || (name === undefined)) {
    throw new WrongKeys();
  }
  bcrypt.hash(req.body.password, 11)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError();
      }
      return res.status(200).send({
        data: {
          name, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else if (err.code === 11000) {
        next(new RepeatEmail());
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if ((email === undefined) || (password === undefined)) {
    throw new WrongKeys();
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongPass());
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongPass());
          }
          return user;
        });
    })
    .then((user) => {
      if (!user) {
        Promise.reject(new WrongPass());
      }
      const token = jwt.sign({ _id: user._id }, soup, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new WrongPass());
    });
};
