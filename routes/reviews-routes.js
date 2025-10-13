const express = require("express");
const router = express.Router({ mergeParams: true });
const { ReviewSchema } = require("../JoiValidator.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const { isLoggedin } = require("../auth-middleware.js");
const reviews_controller = require("../controllers/reviews_controller.js");
const ExpressError = require("../utils/ExpressError.js");

//Validation Function For Reviews
function ReviewValidator(req, res, next) {
  console.log(req.body);
  let { error } = ReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
}

//Reviews POST
router.post("/", ReviewValidator, isLoggedin, reviews_controller.create_review);

//Delte Review Route POST
router.delete("/:reviewId", reviews_controller.delete_review);

module.exports = router;
