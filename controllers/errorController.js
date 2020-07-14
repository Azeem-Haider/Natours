const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicatefieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `This email id already exists ${value} please use and other id`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  return new AppError('invalid token.please login again', 401);
};
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! please login again', 401);
const sendErrorDev = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  //Rendered Website
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: err.message,
  });
};
const sendErrorPro = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming errors:don't leak error details
    console.error('Error', err);
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
  //B)Rendered Website//
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong',
      msg: err.message,
    });
  }
  //programming errors:don't leak error details
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: 'please try again later',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatefieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorPro(error, req, res);
  }
  next();
};
