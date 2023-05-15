const express = require("express");
const AppError = require("./utils/AppError");
const errorHandler = require("./controllers/errorController");
const blogRouter = require("./routes/blog-router");
const userRouter = require("./routes/user-router");
const app = express();
app.use(express.json());
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // const err = new Error(`Page ${req.originalUrl} not found!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Page ${req.originalUrl} not found!`, 404));
});

app.use(errorHandler);
module.exports = app;
