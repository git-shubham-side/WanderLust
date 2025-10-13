const Listing = require("../models/listings");
const multer = require("multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/tilesets");
const accessToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: accessToken });

//Index route
module.exports.index = async (req, res) => {
  // try {
  let alllist = await Listing.find({});
  res.render("listings/index", { alllist });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Server Error");
  // }
};

module.exports.new = (req, res) => {
  res.render("listings/create");
};

module.exports.show = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = await Listing.findById(id).populate("reviews").populate("owner");
    if (!data) {
      req.flash("error", "Oops! requested listing does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { data });
  } catch (err) {
    next(err);
  }
};

//Post request
module.exports.create_post = async (req, res, next) => {
  try {
    console.log(req.body);
    let listing = await new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
    console.log("path: listing-controller.js-------------", req.body);
  } catch (err) {
    next(err);
  }
};

module.exports.edit = async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id);
  res.render("listings/edit", { data });
};

// Edit Route
module.exports.edit_put = async (req, res) => {
  let id = req.params.id;
  let listing = req.body.listing;
  await Listing.findByIdAndUpdate(id, listing, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/listings/${id}`);
};

//destroy--delete
module.exports.destroy = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Listing.findByIdAndDelete(id);
    if (!result) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    if (result) {
      req.flash("success", "Listing Deleted!");
      res.redirect("/listings");
    }
  } catch (err) {
    // console.log("Error Catch", err);
    next(new ExpressError("Error Occured!", 409));
  }
};
