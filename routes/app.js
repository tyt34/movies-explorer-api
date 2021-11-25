const router = require('express').Router();
const {
  login, register,
} = require('../controllers/app');
const {
  logValidator, regValidator,
} = require('../middlewares/validators');

router.post('/signin', logValidator, login);
router.post('/signup', regValidator, register);

module.exports = router;
