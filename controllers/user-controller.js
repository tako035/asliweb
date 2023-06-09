const User = require("../models/user-model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
});

exports.addUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ status: "success", data: user });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError(`${req.params.id} ID numaralı kullanıcı bulunamadı !`, 404)
    );
  }
  res.status(200).json({ status: "success", data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new AppError(`${req.params.id} ID numaralı kullanıcı bulunamadı !`, 404)
    );
  }
  res.status(201).json({ status: "success", data: user });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new AppError(`${req.params.id} ID numaralı kullanıcı bulunamadı !`, 404)
    );
  }
  res.status(204).json({ status: "success", data: null });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "Buradan şifre güncelleme işlemi yapılamaz. Lütfen Şifre güncelleme bölümünden işlem yapınız.",
        400
      )
    );
  }
  const updateBody = filterObj(req.body, "name", "email", "photo");
  const user = await User.findByIdAndUpdate(req.user.id, updateBody, {
    new: true,
    validators: true,
  });
  res.status(200).json({ status: "success", data: updateBody });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }).select(
    "+active"
  );
  res.status(204).json({ status: "success" });
});
