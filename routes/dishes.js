const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const auth = require('../auth');

const dishRouter = express.Router();

// parse request body as json
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then(dishes => res.json(dishes), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then(dish => res.json(dish), err => next(err))
            .catch(err => next(err));
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send('PUT operation not supported on /dishes');
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => res.json(dish), err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res) => {
        res.status(403).send(`POST operation not supported on /dishes/${req.params.dishId}`);
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then(dish => res.json(dish), err => next(err))
            .catch(err => next(err));
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then(result => res.json(result), err => next(err))
            .catch(err => next(err));
    });

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                if (dish) {
                    res.json(dish.comments);
                } else {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then(dish => res.json(dish))
                        .catch(err => next(err));
                } else {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(auth.verifyUser, (req, res) => {
        res.status(403).send(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    dish.comments = [];
                    dish.save()
                        .then(dish => res.json(dish))
                        .catch(err => next(err));
                } else {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish => {
                if (!dish) {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                } else if (!dish.comments.id(req.params.commentId)) {
                    const err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    res.json(dish.comments.id(req.params.commentId));
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(auth.verifyUser, (req, res) => {
        res.status(403)
            .send(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);
    })
    .put(auth.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (!dish) {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                } else if (!dish.comments.id(req.params.commentId)) {
                    const err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    const comment = dish.comments.id(req.params.commentId);
                    if (req.user._id.equals(comment.author)) {
                        if (req.body.rating) {
                            comment.rating = req.body.rating;
                        }
                        if (req.body.comment) {
                            comment.comment = req.body.comment;
                        }
                        dish.save()
                            .then(dish => res.json(dish))
                            .catch(err => next(err));
                    } else {
                        const err = new Error('You cannot modify others\' comments!');
                        err.status = 403;
                        return next(err);
                    }
                }
            })
            .catch(err => next(err));
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (!dish) {
                    const err = new Error(`Dish ${req.params.dishId} not found`);
                    err.status = 404;
                    return next(err);
                } else if (!dish.comments.id(req.params.commentId)) {
                    const err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    const comment = dish.comments.id(req.params.commentId);
                    if (req.user._id.equals(comment.author)) {
                        comment.remove();
                        dish.save()
                            .then(dish => res.json(dish))
                            .catch(err => next(err));
                    } else {
                        const err = new Error('You cannot delete others\' comments!');
                        err.status = 403;
                        return next(err);
                    }
                }
            }).catch(err => next(err));
    });

module.exports = dishRouter;
