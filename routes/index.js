const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use('/', require('./app'));

router.use(auth);
router.use('/', require('./user'));
router.use('/', require('./movie'));

module.exports = router;
