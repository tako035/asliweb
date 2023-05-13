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
      required: [true, "Başlık boş olamaz!"],
      unique: true,
      trim: true,
    },
    // dateCreated: { type: Date, default: Date.now() },
    // datePosted: Date,
    // dateChanged: Date,
    body: {
      type: String,
      required: [true, "Blog içeriği boş olamaz!"],
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
      required: [true, "Yorum yapmalısınız..."],
    },
    author: {
      type: String,
      required: [true, "Bir isim veya rumuz giriniz!"],
      trim: true,
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
