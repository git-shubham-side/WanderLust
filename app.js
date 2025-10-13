const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
let dbUrl = process.env.DB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in mongo session store");
});
const sessionOptions = {
  store,
  secret: "mySecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
const flash = require("connect-flash");
const User = require("./models/user.js");

//Flash
app.use(flash());

app.use(session(sessionOptions));
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//Listing Model----shifted in routes---->

// const Listing = require("./models/listings.js");
// const Review = require("./models/reviews.js");

const { engine, all } = require("express/lib/application");
const ExpressError = require("./utils/ExpressError.js");

//Routes---Require
const listingsRouter = require("./routes/listing-route.js");
const reviewsRouter = require("./routes/reviews-routes.js");
const userRouter = require("./routes/user-routes.js");

//Joi Validator
const Joi = require("joi");
const passport = require("passport");
const LocalStartegy = require("passport-local");

//Shifted in Routes----->

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Database Connection ----------
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then((res) => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//Passport----Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});
//---------------------Routes-------------

//Main Home route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//Listing Routes--
app.use("/listings", listingsRouter);
//Reviews Routes--
app.use("/listings/:id/reviews", reviewsRouter);
//UserRoutes
app.use("/", userRouter);

//-----------------------Random routes Checks
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not found!"));
  // res.render("/listings/error");
});

// Global Error Handling Middleware.
app.use((err, req, res, next) => {
  // console.log(err);
  let { statusCode = 500, message } = err;
  // console.log(statusCode, message);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Server is Listning on PORT ${PORT}`);
});
