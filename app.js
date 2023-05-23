const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/AppError");
const errorHandler = require("./controllers/errorController");
const blogRouter = require("./routes/blog-router");
const userRouter = require("./routes/user-router");
const viewRouter = require("./routes/view-router");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// SERVE STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

//SETTING SECURITY HTTP HEADERS
//app.use(helmet());

// LIMIT REQUESTS FROM SAME API
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: `Mevcut IP'den çok fazla başarısız giriş denemesi oldu. Bir saat içinde tekrar deneyin!`,
});

app.use("/api", limiter);

//BODY PARSER, READING DATA FROM THE BODY INTO req.body
app.use(express.json({ limit: "10kb" }));

// DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT HTTP PARAMETER POLUTION
// app.use(hpp({ whitelist: ['duration']}));
app.use(hpp());

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

// ROUTES
app.use("/", viewRouter);
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
