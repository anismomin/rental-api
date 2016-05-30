/// <reference path="../typings/tsd.d.ts"/>
import mongoose = require('mongoose');
var Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
	name: string;
	username: string;
	email: string;
    password: string;
}

var UserSchema = new Schema({
	name: { type: String, required: true, lowercase: true},
	username: { type: String, required: true, lowercase: true, index: {unique: true }},
	email: { type: String, required: true , index: {unique: true}},
	password: { type: String, required: true, select: false},
	created: { type: Date, default: Date.now }
});

export let User = mongoose.model<IUser>("User", UserSchema);
