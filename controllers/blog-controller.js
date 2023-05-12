const { model } = require("mongoose");
const Blog = require("../models/blog-model");
const BlogComments = require("../models/blog-model");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ status: "success", data: blogs });
  } catch (err) {
    res.status(404).json({ status: "fail", data: null });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const blogContent = { ...blog };
    // const comments = await BlogComments.findById(blog.params.blogId);
    res.status(200).json({ status: "success", data: blog });
  } catch (err) {
    res.status(404).json({ status: "tako", data: null });
  }
};
