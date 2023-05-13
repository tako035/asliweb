const express = require("express");
const blogController = require("../controllers/blog-controller");
const router = express.Router();

router.route("/").get(blogController.getAllBlogs).post(blogController.addBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);
// router.route("/:id").patch(blogController.updateComment);
router
  .route("/:id/comment")
  .post(blogController.addComment)
  .patch(blogController.updateComment)
  .delete(blogController.deleteComment);
module.exports = router;
