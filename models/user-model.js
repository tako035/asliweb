const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Geçerli bir kullanıcı adı girin"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Bir eposta adresi girin"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Geçerli bir eposta adresi girin"],
    trim: true,
  },
  photo: String,
  password: { type: String, required: [true, "Şifre girin"], minlength: 8 },
  confirmPassword: {
    type: String,
    required: [true, "Şifrenizi onaylayın"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Girdiğiniz şifre aynı değil!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
