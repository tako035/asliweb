const express = require("express");
const blogController = require("../controllers/blog-controller");
const router = express.Router();

router.route("/").get(blogController.getAllBlogs);

router.route("/:id").get(blogController.getBlog);

module.exports = router;
