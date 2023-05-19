const express = require("express");
const blogController = require("../controllers/blog-controller");
const authController = require("../controllers/auth-controller");
const router = express.Router();

router.route("/").get(blogController.getAllBlogs).post(blogController.addBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    blogController.deleteBlog
  );
// router.route("/:id").patch(blogController.updateComment);
router
  .route("/:id/comment")
  .post(blogController.addComment)
  .patch(blogController.updateComment)
  .delete(blogController.deleteComment);
module.exports = router;
