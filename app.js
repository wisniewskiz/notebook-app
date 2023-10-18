const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const moment = require('moment');

const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');

const AppError = require('./AppError');
const Note = require('./models/note');


mongoose.connect('mongodb://localhost:27017/notebook');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/notes', async (req, res) => {
    const notes = await Note.find({});
    res.render('./notes/notebook', { notes, moment: moment });
});
app.post('/notes', wrapAsync(async (req, res, next) => {
        const note = new Note(req.body.note);
        await note.save();
        res.redirect('/notes');
    
}));
app.put('/notes/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const note = await Note.findByIdAndUpdate(id, {...req.body.note}, { runValidators: true});
        res.redirect(`./${id}`); 
}));


app.get('/notes/:id/edit', wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('./notes/edit', { note });
}));
app.delete('/notes/:id', async (req, res, next) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect('/notes');
});

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    };
};

app.get('/notes/:id', wrapAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return next(new AppError('Note not found', 404));
    };
    res.render('notes/single', { note, moment: moment });
}));

app.use((err, req, res, next) => {
    const { status = 500, message = 'Uh oh, something went wrong' } = err; 
    res.status(status).send(message);
});



app.listen(3000, () => {
    console.log('serving on port 3000');
});