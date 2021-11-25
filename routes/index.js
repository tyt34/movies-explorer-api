const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.use('/', require('./app'));
router.use(auth);
router.use('/', require('./user'));
router.use('/', require('./movie'));

module.exports = router;
