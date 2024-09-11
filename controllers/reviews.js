const asyncHandler = require("../middleware/async");
const BootCamp = require("../models/BootCamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");

// get all review of a bootcamp
exports.getReviews = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// get a single review of a bootcamp
exports.getReview = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`no review found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// add a single review of a bootcamp
exports.addReview = asyncHandler(async (req, res, next) => {
  console.log(req.params)
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await BootCamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `no bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(200).json({
    success: true,
    data: review,
  });
});


exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});


exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});