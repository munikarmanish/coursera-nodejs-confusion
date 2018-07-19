const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const auth = require('../auth');

const router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    User.register(new User({ username }), password, err => {
        if (err) {
            res.status(500).json({ err });
        } else {
            passport.authenticate('local')(req, res, () => {
                res.json({ success: true, status: 'Registration successful' });
            });
        }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = auth.getToken({ _id: req.user._id });
    res.json({
        success: true,
        status: 'Login successful',
        token
    });
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.send('Logout successful');
    } else {
        const err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }
});

module.exports = router;
