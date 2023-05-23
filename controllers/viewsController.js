const { Blog, BlogComments } = require("../models/blog-model");
const catchAsync = require("../utils/catchAsync");

exports.getBlogOverview = catchAsync(async (req, res) => {
  //GET BLOG DATA FROM COLLECTION
  const blogs = await Blog.find();
  //BUILD TEMPLATE

  //RENDER WEB PAGE
  res.status(200).render("blogoverview", { title: "TÜM YAZILAR", blogs });
});

exports.getBlog = catchAsync(async (req, res) => {
  //GET THE SPESIFIC BLOG AND THE COMMENTS
  const blog = await Blog.findOne({ slug: req.params.slug });

  const commentId = blog._id.toString();
  const comments = await BlogComments.find({ blogId: commentId });

  res.status(200).render("blog", { blog, comments });
});
