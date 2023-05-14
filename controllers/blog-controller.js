const mongoose = require("mongoose");
const { Blog, BlogComments } = require("../models/blog-model");
const AppError = require("../utils/AppError");

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find();
  console.log(req.body);
  res.status(200).json({ status: "success", data: blogs });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError(`No blog found with ID ${req.params.id} !`, 404));
  }
  const commentId = blog._id.toString();
  const comments = await BlogComments.find({ blogId: commentId });
  res.status(200).json({ status: "success", data: { blog, comments } });
});

exports.addBlog = catchAsync(async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.status(201).json({ status: "success", data: newBlog });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return next(new AppError(`No blog found with ID ${req.params.id} !`, 404));
  }
  res.status(201).json({ status: "success", data: blog });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.deleteOne({ _id: req.params.id });
  if (!blog) {
    return next(new AppError(`No blog found with ID ${req.params.id} !`, 404));
  }
  await BlogComments.deleteMany({ blogId: req.params.id });
  res.status(204).json({ status: "success", data: null });
});

exports.addComment = catchAsync(async (req, res) => {
  req.body.blogId = req.params.id;
  const comment = await BlogComments.create(req.body);
  res.status(201).json({ status: "success", data: comment });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await BlogComments.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!comment) {
    return next(
      new AppError(`No comment found with ID ${req.body._id} !`, 404)
    );
  }
  res.status(201).json({ status: "success", data: comment });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await BlogComments.deleteOne({ _id: req.body._id });
  if (!comment) {
    return next(
      new AppError(`No comment found with ID ${req.body._id} !`, 404)
    );
  }
  res.status(204).json({ status: "success", data: null });
});
// exports.updateComment = async (req, res) => {
//   try {
//     const comment = await BlogComments.FindByIdAndUpdate(req.params.id);
//     res.status(200).json({ status: "success", data: blog });
//   } catch (err) {
//     res.status(404).json({ status: "error", data: null });
//   }
// };
