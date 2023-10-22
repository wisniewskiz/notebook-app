const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');


const path = require('path');
const engine = require('ejs-mate');

const AppError = require('./utils/AppError');
const notesRoutes = require('./routes/notes');
const subjectsRoutes = require('./routes/subjects');
const userRoutes = require('./routes/users');
const User = require('./models/user');

const sessionConfig = {
    secret: 'thishouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 14 * 7,
        maxAge: 1000 * 60 * 60 * 14 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

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
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy({
    usernameField: "email"
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/notes', notesRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/', userRoutes);

app.use((err, req, res, next) => {
    console.log(err.name);
    next(err);
});

app.all('*', (req, res, next) => {
    next(new AppError('page note found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Uh oh, something went wrong' } = err; 
    res.status(status).render('error', { err });
    console.log(res.locals);
    next();
});



app.listen(3000, () => {
    console.log('serving on port 3000');
});