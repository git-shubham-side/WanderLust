const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../auth-middleware");
const user_controller = require("../controllers/user_controller");

router.get("/signup", user_controller.signup_get);

router.post("/signup", user_controller.signup_post);

router.get("/login", user_controller.login_get);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  user_controller.login_post
);

router.get("/logout", user_controller.logout);
module.exports = router;
