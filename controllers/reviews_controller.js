const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");

//Post review
module.exports.create_review = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let review = await new Review(req.body.review);
    review.author = req.user_id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports.delete_review = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findOneAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
