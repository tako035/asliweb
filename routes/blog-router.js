const express = require("express");
const blogController = require("../controllers/blog-controller");
const router = express.Router();

router.route("/").get(blogController.getAllBlogs).post(blogController.addBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog);
// router.route("/:id").patch(blogController.updateComment);

module.exports = router;
