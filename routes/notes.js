const express = require('express');
const router = express.Router();

const moment = require('moment');

const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/catchAsync');
const validateNote = require('../utils/validateNote');
const { isLoggedIn } =require('../middleware');
const Subject = require('../models/subject');
const User = require('../models/user');
const Note = require('../models/note');

router.get('/', isLoggedIn, (async (req, res) => {
    const user = await User.findById(req.user._id).populate('notes');
    const notes = user.notes;
    const subjects = await Subject.find({});
    res.render('./notes/notebook', { notes, subjects, moment: moment });
}));
router.post('/', isLoggedIn, validateNote, wrapAsync(async (req, res, next) => {
        const note = new Note(req.body.note);
        const owner = res.locals.currentUser._id;
        let subject
        note.owner = owner;
        await note.save();

        const user = await User.findById(owner);
        user.notes.push(note._id);
        await user.save()

        if(note.subject) {
           subject = await Subject.findById(note.subject);
           subject.notes.push(note._id);
           await subject.save();
        }
        res.redirect('/notes');

    
}));
router.put('/:id', isLoggedIn, validateNote, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const note = await Note.findByIdAndUpdate(id, {...req.body.note}, { runValidators: true});
        res.redirect(`./${id}`); 
}));


router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('./notes/edit', { note });
}));


router.delete('/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;;
    await Note.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted note');
    res.redirect('/notes');
});

router.get('/:id', isLoggedIn, wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('notes/single', { note, moment: moment });
}));

module.exports = router;