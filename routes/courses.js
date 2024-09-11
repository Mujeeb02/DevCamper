const express = require("express");
const Courses = require("../models/Course");
const {
  getCourses,
  getCourse,
  postCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Courses, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect,authorize('publisher','admin'), postCourse);
router.route("/:id").get(getCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse);
module.exports = router;
