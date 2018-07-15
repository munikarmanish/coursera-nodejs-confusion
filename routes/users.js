const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                const err = new Error(`User ${req.body.username} already exists`);
                err.status = 403;
                next(err);
            } else {
                User.create(req.body)
                    .then(user => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ status: 'Registraction successful', user });
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
    if (!req.session.user) {
        const { username, password } = req.body;
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    const err = new Error(`User ${username} doesn't exist`);
                    err.status = 403;
                    next(err);
                } else if (password === user.password) {
                    req.session.user = 'authenticated';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You are authenticated');
                } else {
                    const err = new Error('Incorrect password');
                    err.status = 403;
                    next(err);
                }
            })
            .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated');
    }
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie();
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }
});

module.exports = router;
