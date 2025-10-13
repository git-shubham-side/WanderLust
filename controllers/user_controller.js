const User = require("../models/user");

module.exports.signup_get = (req, res) => {
  res.render("./users/signup");
};

module.exports.signup_post = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });
    const registredUser = await User.register(newUser, password);
    // console.log(ReistredUser);
    req.login(registredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "Oops! " + e.message + ".");
    res.redirect("/signup");
  }
};

module.exports.login_get = (req, res) => {
  res.render("./users/login");
};

module.exports.login_post = async (req, res) => {
  req.flash("success", "Glad to see you again!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out!");
    res.redirect("/listings");
  });
};
