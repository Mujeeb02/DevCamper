const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// get all users
exports.getUsers = asyncHandler(async (req, res, next) => {
    console.log(res.advancedResults)
  res.status(200).json(res.advancedResults);
});

// get a single User
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`user not found with id ${req.params.id}`, 401)
    );
  }
  res.status(200).json({ success: true, data: user });
});

// create a user
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({ success: true, data: user });
});

// update a user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`user not found with id ${req.params.id}`, 401)
    );
  }
  res.status(200).json({ success: true, data: user });
});

// delete a user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`user not found with id ${req.params.id}`, 401)
    );
  }
  res.status(200).json({ success: true, data:{} });
});
