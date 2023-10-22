const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('./users/register');
});

router.post('/register', wrapAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = new User({email, password});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    res.redirect('/notes');
}));

router.get('/login', (req, res) => {
    res.render('./users/login');
});

router.post('/login', passport.authenticate('local', {
    failureFlash : true,
    failureRedirect : '/login'
}), (req, res) => {
    req.flash('success', 'welcome back');
    res.redirect('/notes');
});

module.exports = router;