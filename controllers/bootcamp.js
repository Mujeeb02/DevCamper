// @desc get all bootcamps
// @route GET /api/v1/bootcamps
const path = require("path");
const asyncHandler = require("../middleware/async");
const BootCamp = require("../models/BootCamp");
const ErrorResponse = require("../utils/errorResponse");

// @access public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    res: res.advancedResults,
  });
});

// @desc get single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  console.log(req.params.id);
  const bootcamp = await BootCamp.findById(id).populate("courses");
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc post a bootcamps
// @route POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });
  if (publishedBootcamp && req.user.role === "admin") {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await BootCamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootCamp.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  console.log("in delete bootcamp");
  const response = await BootCamp.findById(req.params.id);
  if (!response) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  if (response.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  console.log(response);
  response.remove();
  res
    .status(200)
    .json({ success: true, message: "bootcamp deleted successfully" });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// upload a photo to the bootcamp

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await BootCamp.findById(id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`please upload a photo`), 400);
  }

  console.log(req.files.file);

  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`please upload a valid image`), 400);
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `please upload image with size less than ${process.env.MAX_FILE_UPLOAD}`
      ),
      400
    );
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`error while uploading`));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
  });
  res.status(200).json({
    success: true,
    data: file.name,
  });
});
