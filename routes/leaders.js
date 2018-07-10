const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

// parse request body as json
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Sending all leaders');
    })
    .post((req, res) => {
        res.end(`Adding new leader with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res) => {
        res.end('Deleting all leaders');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Sending details of leader: ${req.params.leaderId}`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
    })
    .put((req, res) => {
        res.end(`Updating leader: ${req.params.leaderId} with name: "${req.body.name}" and description: "${req.body.description}"`);
    })
    .delete((req, res) => {
        res.end(`Deleting leader: ${req.params.leaderId}`);
    });

module.exports = leaderRouter;
