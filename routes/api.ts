/// <reference path="../typings/tsd.d.ts"/>

import express = require('express');
import * as jwt from 'jsonwebtoken';
var crypto = require('crypto');
import {IUser, User} from '../model/user';
import config  = require('../config');

var api = express.Router();
let secreKey = config.secretKey;

function hash(password : string) {
	return crypto.createHash('sha256').update(password).digest('hex');
}


api
.post('/signup', function(req : express.Request, res: express.Response){
	
	let user = new User({
		name: req.body.name,
		username: req.body.username.toLowerCase(),
		email: req.body.email.toLowerCase(),
		password: hash(req.body.password)
	});

	user.save(function(err :any) {

		(err: any) => res.json(err);

		res.json({ message: 'user has been created succesfully!' })
	});
})
.post('/login', function(req : express.Request, res: express.Response){
	
	User.findOne({ 
		username: req.body.username 
	}, function(err : Error , user : IUser) {
		
		if(err) { throw err; }

		if(!user) {
			
			res.json({ success: false, message: 'Authentication failed. User not found.' });

		} else if (user) {

			if(user.password == hash(req.body.password) ) {
				res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				let token = jwt.sign(user, secreKey, { expiresIn: '24h' });

				res.json({ success: true, message: user, token: token });
			}	
		}
	});
})
.use(function(req : express.Request, res: express.Response, next: any ){

	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	
	if(token) {
		jwt.verify(token, secreKey, function(err: Error, decoded : any) {
			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).send({success: false, message: 'No token provided'});	
	}
})
.get('/', function(req : express.Request, res: express.Response){
	
	User.find({}, function(err: Error, user: Array<any>) {

		(err: any) => res.json(err);

		res.json(user)
	});
})
.delete('/:id', function(req : express.Request, res: express.Response){
	
	User.remove({ _id: req.params.id }, function(err : Error) {
		res.json({ message: 'user is deleted' });
	});

});

module.exports = api;
