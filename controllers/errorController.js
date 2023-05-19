const AppError = require("../utils/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.error("ERROR ! :", err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else
    res.status(500).json({ status: "error", message: "something went wrong!" });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  new AppError(message, 400);
};

const handleDublicateFieldError = (err) => {
  const message = `Dublicate field value : ${err.keyValue.title} not allowed!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) => {
  return new AppError("Hatalı Jeton. Lütfen yeniden giriş yapın!", 401);
};

const handleTExpError = (err) => {
  return new AppError("Jeton süresi doldu. Lütfen yeniden giriş yapın!", 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let errDB = { ...err, name: err.name };
    if (errDB.name === "CastError") {
      errDB = handleCastErrorDB(errDB);
    }
    if (errDB.code === 11000) errDB = handleDublicateFieldError(errDB);
    if (errDB.name === "ValidationError") errDB = handleValidationError(errDB);
    if (errDB.name === "JsonWebTokenError") errDB = handleJWTError(errDB);
    if (errDB.name === "TokenExpiredError") errDB = handleTExpError(errDB);
    sendErrorProd(errDB, res);
  }
};
