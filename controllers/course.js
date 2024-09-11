const asyncHandler = require("../middleware/async");
const BootCamp = require("../models/BootCamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  }
  else{
    res.status(200).json(res.advancedResults)
  }
});

// get single course with id

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// post a course to a specific bootcamp

exports.postCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user=req.user.id;
  const bootcamp = await BootCamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`bootcamp not found with id ${req.params.bootcampId}`),
      404
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add course to the bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// update a course to a specific bootcamp
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}`),
      404
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course`,
        401
      )
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// delete a course with its id
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}`),
      404
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course`,
        401
      )
    );
  }
  await course.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
