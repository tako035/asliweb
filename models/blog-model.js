const mongoose = require("mongoose");
const slugify = require("slugify");

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
    slug: String,
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

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
// blogCommentSchema.pre("save", (next) => {
//   this.blogId = Blog._id;
//   next();
// });
const Blog = new mongoose.model("posts", blogSchema);
const BlogComments = new mongoose.model("comments", blogCommentSchema);

module.exports = { Blog, BlogComments };
