const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  author: {
    userid: String,
    name: String,
    profPic: String,
  },
  title: {
    type: String,
    required: [true, "Başlık boş olamaz!"],
    trim: true,
  },
  dateCreated: Date,
  datePosted: Date,
  dateChanged: Date,
  body: {
    type: String,
    required: [true, "Blog içeriği boş olamaz!"],
  },
  image: String,
});

const blogCommentSchema = new mongoose.Schema({
  blogId: String,
  datePosted: Date,
  text: {
    type: String,
    required: [true, "Yorum yapmalısınız..."],
  },
  author: {
    type: String,
    required: [true, "Bir isim veya rumuz giriniz!"],
    trim: true,
  },
});

const Blog = new mongoose.model("posts", blogSchema);
// const BlogComments = new mongoose.model("comments", blogCommentSchema);

module.exports = Blog;
// module.exports = { Blog, BlogComments };
