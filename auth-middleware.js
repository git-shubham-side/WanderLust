const Listing = require("./models/listings");

function isLoggedin(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Sorry! you must logged-in before making changes.");
    return res.redirect("/login");
  }
  next();
}

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  let id = req.params.id;
  let listing = req.body.listing;
  let list = await Listing.findByIdAndUpdate(id);
  if (!list.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "Sorry!You dont't have permission to make changes.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Validation Function for Listing
const listingValidator = async (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    console.log(req.body);
    console.log("Listing Middleware probem");
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
};

module.exports = { isLoggedin, saveRedirectUrl, isOwner, listingValidator };
