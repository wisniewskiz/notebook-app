const express = require('express');
const router = express.Router();

const moment = require('moment');

const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/catchAsync');
const validateNote = require('../utils/validateNote');
const Note = require('../models/note');
const Subject = require('../models/subject');


router.get('/', async (req, res) => {
    const notes = await Note.find({});
    const subjects = await Subject.find({});
    res.render('./notes/notebook', { notes, subjects, moment: moment });
});
router.post('/', validateNote, wrapAsync(async (req, res, next) => {
        const note = new Note(req.body.note);
        console.log(note);
        await note.save();
        res.redirect('/notes');
    
}));
router.put('/:id', validateNote, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const note = await Note.findByIdAndUpdate(id, {...req.body.note}, { runValidators: true});
        res.redirect(`./${id}`); 
}));


router.get('/:id/edit', wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('./notes/edit', { note });
}));
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect('/notes');
});

router.get('/:id', wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('notes/single', { note, moment: moment });
}));

module.exports = router;