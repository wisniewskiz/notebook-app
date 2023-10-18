const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const notesRoutes = require('./routes/notes');



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

app.use('/notes', notesRoutes);

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
});



app.listen(3000, () => {
    console.log('serving on port 3000');
});