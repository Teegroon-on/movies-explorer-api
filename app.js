require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { errorHandler } = require('./midlewares/errorHandler');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const router = require('./routes/index');
const limiter = require('./utils/limiter');

const { DATA_BASE, NODE_ENV } = process.env;

const { PORT = 3000 } = process.env;
const DATABASE_URL = NODE_ENV === 'production' ? DATA_BASE : 'mongodb://127.0.0.1:27017/bitfilmsdb';
const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
