const jwt = require('jsonwebtoken');
const NeedAuth = require('../errors/need-auth');
require('dotenv').config();

let soup = 'dev-secret';

if (process.env.NODE_ENV === 'production') {
  soup = process.env.JWT_SECRET;
} else {
  soup = 'dev-secret';
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NeedAuth());
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, soup);
    } catch (e) {
      next(new NeedAuth());
    }
    req.user = payload;
    next();
  }
};
