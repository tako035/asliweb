const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    author: {
      userid: String,
      name: String,
      profPic: String,
    },
    title: {
      type: String,
      required: [true, "Başlık giriniz!"],
      unique: true,
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Blog içeriği giriniz!"],
    },
    image: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const blogCommentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId },
    datePosted: { type: Date, default: Date.now() },
    text: {
      type: String,
      required: [true, "Yorum giriniz."],
    },
    author: {
      type: String,
      required: [true, "Bir isim veya rumuz giriniz!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Yorum yapmak için geçerli bir e-posta giriniz"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// blogCommentSchema.pre("save", (next) => {
//   this.blogId = Blog._id;
//   next();
// });
const Blog = new mongoose.model("posts", blogSchema);
const BlogComments = new mongoose.model("comments", blogCommentSchema);

module.exports = { Blog, BlogComments };
