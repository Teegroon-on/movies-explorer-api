const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, logout, createUser } = require('../controllers/users');
const auth = require('../midlewares/auth');
const { NOT_FOUND_TEXT } = require('../utils/constants');
const {
  userValidator,
  userLoginValidator,
} = require('../midlewares/userValidator');
const NotFoundError = require('../httpStatus/notFound');

router.post('/signup', userValidator, createUser);
router.post('/signin', userLoginValidator, login);
router.use(auth);
router.get('/signout', auth, logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_TEXT));
});

module.exports = router;
