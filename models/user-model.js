const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

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
  role: { type: String, enum: ["user", "admin"], default: "user" },
  photo: String,
  password: {
    type: String,
    required: [true, "Şifre girin"],
    select: false,
    minlength: 8,
  },
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
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model("users", userSchema);

module.exports = User;
