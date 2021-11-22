const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUser, updateUser,
} = require('../controllers/user');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
