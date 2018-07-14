const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const dishRouter = require('./routes/dishes');
const promotionRouter = require('./routes/promotions');
const leaderRouter = require('./routes/leaders');

mongoose.connect('mongodb://localhost:54321/conFusion', { useNewUrlParser: true })
    .then(() => {
        console.log('Successfully connected to MongoDB server');
    }).catch(err => console.log(err));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

// Authorization middleware
function auth(req, res, next) {
    console.log(req.signedCookies);

    if (!req.signedCookies.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated');
            err.status = 401;
            res.setHeader('WWW-Authenticate', 'Basic');
            next(err);
        } else {
            const [username, password] = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
            if (username === 'admin' && password === 'password') {
                res.cookie('user', 'admin', { signed: true });
                next();
            } else {
                const err = new Error('You are not authenticated');
                err.status = 401;
                res.setHeader('WWW-Authenticate', 'Basic');
                next(err);
            }
        }
    } else {
        if (req.signedCookies.user === 'admin') {
            next();
        } else {
            const err = new Error('You are not authenticated');
            err.status = 401;
            res.setHeader('WWW-Authenticate', 'Basic');
            next(err);
        }
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
