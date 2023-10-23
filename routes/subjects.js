const express = require('express');
const router = express.Router();

const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/catchAsync');
const Subject = require('../models/subject')
const User = require('../models/user');

router.post('/', wrapAsync(async (req, res, next) => {
    const subject = new Subject(req.body.subject);
    const user = await User.findById(res.locals.currentUser._id)
    subject.owner.push(user._id);
    user.subjects.push(subject);
    await subject.save();
    await user.save();
    res.redirect('/notes');
}));


module.exports = router;