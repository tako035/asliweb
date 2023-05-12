const express = require("express");
const app = express();
const blogRouter = require("./routes/blog-router");

app.use("/api/v1/blog", blogRouter);

module.exports = app;
