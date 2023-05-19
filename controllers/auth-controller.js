const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = signToken(newUser._id);
  res.status(201).json({ status: "success", token, data: newUser });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Lütfen giriş bilgilerini girin!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Kullanıcı Adı veya şifre hatalı!", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({ status: "success", token });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 GET TOKEN AND CHECK IF IT IS THERE
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("Kullanıcı girişi yapılmamış. Lütfen giriş yapınız", 401)
    );
  }

  exports.restrictTo = (...roles) => {
    return (req, res, next) => {};
  };

  // TOKEN VERIFICATION
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF USER EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "Jeton bilgileri geçerli değil. Lütfen yeniden giriş yapınız!",
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter) {
    return next(
      new AppError(
        "Kayıtlı hesap bilgileri geçerli değil. Yeniden giriş yapınız!",
        401
      )
    );
  }
  // CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Kullanıcı yakın bir zamanda şifresini değiştirmiş. Yeniden giriş yapın!",
        401
      )
    );
  }

  // GRANTED. CONTINUE
  req.user = currentUser;
  next();
});
