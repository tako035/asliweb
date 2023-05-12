const mongoose = require("mongoose");
const Blog = require("../models/blog-model");
// const { Blog, BlogComments } = require("../models/blog-model");
const app = require("../app");

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({ status: "success", data: blogs });
});

exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const commentId = blog._id.toString();
  const comments = await BlogComments.find({ blogId: commentId });
  res.status(200).json({ status: "success", data: { blog, comments } });
});

exports.addBlog = catchAsync(async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.status(201).json({ status: "success", data: newBlog });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const blog = await Blog.FindByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: blog });
});

// exports.updateComment = async (req, res) => {
//   try {
//     const comment = await BlogComments.FindByIdAndUpdate(req.params.id);
//     res.status(200).json({ status: "success", data: blog });
//   } catch (err) {
//     res.status(404).json({ status: "error", data: null });
//   }
// };
