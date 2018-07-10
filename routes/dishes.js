const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

// parse request body as json
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Sending all dishes');
    })
    .post((req, res) => {
        res.end(`Adding new dish with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res) => {
        res.end('Deleting all dishes');
    });

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Sending details of dish: ${req.params.dishId}`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
    })
    .put((req, res) => {
        res.end(`Updating dish: ${req.params.dishId} with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .delete((req, res) => {
        res.end(`Deleting dish: ${req.params.dishId}`);
    });

module.exports = dishRouter;
