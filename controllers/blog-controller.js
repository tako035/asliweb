const mongoose = require("mongoose");
const { Blog, BlogComments } = require("../models/blog-model");

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find();
  console.log(req.body);
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
  if (!blog) {
    console.log("No blog found!!!");
  }
  res.status(201).json({ status: "success", data: blog });
});

exports.deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.deleteOne({ _id: req.params.id }).then(
    await BlogComments.deleteMany({ blogId: req.params.id })
  );
  res.status(204).json({ status: "success", data: null });
});

exports.addComment = catchAsync(async (req, res) => {
  req.body.blogId = req.params.id;
  const comment = await BlogComments.create(req.body);
  res.status(201).json({ status: "success", data: comment });
});

exports.updateComment = catchAsync(async (req, res) => {
  console.log(req.body._id);
  const comment = await BlogComments.FindByIdAndUpdate(
    "645f8480a032124023444801",
    { text: "Bu deneme ile mevcut blog içeriği değiştirilmiş oldu" }
    // {
    //   new: true,
    //   runValidators: true,
    // }
  );
  res.status(201).json({ status: "success", data: comment });
});

exports.deleteComment = catchAsync(async (req, res) => {
  const comment = await BlogComments.deleteOne({ _id: req.body._id });
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
