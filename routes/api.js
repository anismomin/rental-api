/// <reference path="../typings/tsd.d.ts"/>
"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var user_1 = require('../model/user');
var config = require('../config');
var api = express.Router();
var secreKey = config.secretKey;
function hash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
api
    .post('/signup', function (req, res) {
    var user = new user_1.User({
        name: req.body.name,
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hash(req.body.password)
    });
    user.save(function (err) {
        (function (err) { return res.json(err); });
        res.json({ message: 'user has been created succesfully!' });
    });
})
    .post('/login', function (req, res) {
    user_1.User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else if (user) {
            if (user.password == hash(req.body.password)) {
                res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
            else {
                var token = jwt.sign(user, secreKey, { expiresIn: '24h' });
                res.json({ success: true, message: user, token: token });
            }
        }
    });
})
    .use(function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secreKey, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.status(403).send({ success: false, message: 'No token provided' });
    }
})
    .get('/', function (req, res) {
    user_1.User.find({}, function (err, user) {
        (function (err) { return res.json(err); });
        res.json(user);
    });
})
    .delete('/:id', function (req, res) {
    user_1.User.remove({ _id: req.params.id }, function (err) {
        res.json({ message: 'user is deleted' });
    });
});
module.exports = api;
