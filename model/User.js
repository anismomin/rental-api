"use strict";
/// <reference path="../typings/tsd.d.ts"/>
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, lowercase: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    created: { type: Date, default: Date.now }
});
exports.User = mongoose.model("User", UserSchema);
