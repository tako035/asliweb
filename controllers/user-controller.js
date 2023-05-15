const User = require("../models/user-model");
const catchAsync = require("../utils/catchAsync");

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
