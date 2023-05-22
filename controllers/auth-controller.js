const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const sendMail = require("../controllers/email");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  console.log(user.password);
  res.status(statusCode).json({ status: "success", token, data: { user } });
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Buna yetkiniz yok!", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED POSTED EMAİL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Kullanıcı bulunamadı. Tekrar Deneyin", 401));
  }
  //GENERATE  THE RANDOM RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // SEND MAIL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Şifrenizi mi unuttunuz? Şifrenizi değiştirmek için ${resetUrl} adresine istek gönderiniz.\n Eğer şifrenizi unutmadıysanız bu epostayı önemsemeyiniz.`;
  try {
    await sendMail({
      email: user.email,
      subject: "Şifre değiştirmek için 10 dakikanız var!",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Şifre değiştirme talebi eposta hesabına gönderildi.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      AppError(
        "Eposta gönderirken bir hata oluştu lüften daha sonra tekrar deneyiniz.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED ON THE TOKEN
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // IF TOKEN NO EXPIRED SET NEW PASSWORD
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("İşlem süresi doldu. Yeniden deneyiniz!", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // UPDATE CHANGEDPASSWORDAT PROPERTY FOR THE USER

  //LOG THE USER IN AND SEND JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //GET USER FROM COLLECTION

  const user = await User.findById(req.user.id).select("+password");

  // CHECK IF CURRENT PASSWORD IS CORRECT

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError("Girdiğiniz şifre hatalı. Tekrar deneyiniz.", 401)
    );
  }
  // UPDATE PASSWORD

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  createSendToken(user, 200, res);
});
