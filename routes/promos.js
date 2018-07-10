const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

// parse request body as json
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Sending all promotions');
    })
    .post((req, res) => {
        res.end(`Adding new promotion with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res) => {
        res.end('Deleting all promotions');
    });

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Sending details of promotion: ${req.params.promoId}`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
    })
    .put((req, res) => {
        res.end(`Updating promotion: ${req.params.promoId} with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .delete((req, res) => {
        res.end(`Deleting promotion: ${req.params.promoId}`);
    });

module.exports = promoRouter;
