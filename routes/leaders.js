const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const auth = require('../auth');

const leaderRouter = express.Router();

// parse request body as json
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then(leaders => res.json(leaders), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then(leader => res.json(leader), err => next(err))
            .catch(err => next(err));
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send('PUT operation not supported on /leaders');
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then(leader => res.json(leader), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send(`POST operation not supported on /leaders/${req.params.leaderId}`);
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
            .then(leader => res.json(leader), err => next(err))
            .catch(err => next(err));
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

module.exports = leaderRouter;
