const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundAddress = require('./errors/not-found-address');
require('dotenv').config();
let nameDb;
const { limiter } = require('./configRateLimiter');

if ((process.env.NODE_ENV === 'production') && (process.env.nameDb !== undefined)) {
  nameDb = process.env.nameDb;
} else {
  nameDb = 'moviesdb';
}

const { PORT = 3000 } = process.env;
const app = express();

const options = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options.origin));

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/'+nameDb, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('The server must crash');
  }, 0);
});

app.use(routes)

app.use(() => {
  throw new NotFoundAddress();
});

app.use(errorLogger);
app.use(errors());



app.use((err, req, res, next) => {
  console.log(' => ', err.name);
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(PORT);
});
