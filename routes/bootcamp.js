const express = require("express");

const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

const router = express.Router();

// Import Bootcamp model
const Bootcamp = require("../models/BootCamp");
//include other resourde routers too
const courseRouter = require("./courses");
const reviewRouter=require("./reviews")
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// reroute into other resource routers too
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews",reviewRouter)

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
  .post(protect,authorize('publisher','admin'), createBootcamp);

// for all routes that deals with single bootcamp(with id)
router
  .route("/:id")
  .get(getSingleBootcamp)
  .put(protect,protect,authorize('publisher','admin'),updateBootcamp)
  .delete(protect,authorize('publisher','admin'),deleteBootcamp);
router.route("/:id/photo").put(protect,authorize('publisher','admin'),bootcampPhotoUpload);

module.exports = router;
