const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { NODE_ENV, DB_LINK } = process.env;
const helmet = require('helmet');
const cors = require('cors')
const rateLimit = require('express-rate-limit');

const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const DATABASE_URL =  NODE_ENV === 'production' ? DB_LINK : 'mongodb://127.0.0.1:27017//bitfilmsdb';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(cors());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
