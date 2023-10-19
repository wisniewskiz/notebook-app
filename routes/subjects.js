const express = require('express');
const router = express.Router();

const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/catchAsync');
const Subject = require('../models/subject')

router.post('/', wrapAsync(async (req, res, next) => {
    const subject = new Subject(req.body.subject);
    await subject.save();
    res.redirect('/notes');
}));


module.exports = router;