const express = require("express");
const blogRouter = require("./routes/blog-router");
const app = express();
app.use(express.json());
app.use("/api/v1/blog", blogRouter);

module.exports = app;
