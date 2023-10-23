const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("./users/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, function(err) {
        if(err) next(err);
        res.redirect("/notes");
    })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
  })
);

router.get("/login", (req, res) => {
  res.render("./users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back");
    res.redirect("/notes");
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "You have logged out");
  res.redirect("/login");
});

module.exports = router;
