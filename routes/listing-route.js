const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const { ListingSchema } = require("../JoiValidator.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin, isOwner } = require("../auth-middleware.js");
const listing_controller = require("../controllers/listing-controller.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//Validation Function for Listing
function listingValidator(req, res, next) {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    console.log(req.body);
    console.log("Listing Middleware probem");
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
}

//Routing ---------- Index Route
// router.get("/", (req, res) => {
//   res.redirect("/listings");
// });

//Index Route ----------------
router.get("/", listing_controller.index);

//New Route--------------
router.get("/new", isLoggedin, listing_controller.new);

//Show Route-----------------
router.get("/:id", listing_controller.show);

//Create Route---  & Joi Middleware as ListingValidator
router.post("/", isLoggedin, listingValidator, listing_controller.create_post);

//Edit Route-----------
router.get("/:id/edit", isLoggedin, listing_controller.edit);

//Edit PUT Route & Joi Listing Validator
router.put(
  "/:id",
  isLoggedin,
  isOwner,
  listingValidator,
  listing_controller.edit_put
);

//Destroy Route--Delete Route------
router.delete("/:id", isLoggedin, isOwner, listing_controller.destroy);

module.exports = router;
