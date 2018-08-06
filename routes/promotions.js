const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const auth = require('../auth');

const promotionRouter = express.Router();

// parse request body as json
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then(promotions => res.json(promotions), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then(promotion => res.json(promotion), err => next(err))
            .catch(err => next(err));
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send('PUT operation not supported on /promotions');
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Promotions.remove({})
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

promotionRouter.route('/:promotionId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promotionId)
            .then(promotion => res.json(promotion), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send(`POST operation not supported on /promotions/${req.params.promotionId}`);
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promotionId, { $set: req.body }, { new: true })
            .then(promotion => res.json(promotion), err => next(err))
            .catch(err => next(err));
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promotionId)
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

module.exports = promotionRouter;
