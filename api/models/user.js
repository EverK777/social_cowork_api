'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = Schema({
	name: String,
	surname: String,
	nick: String,
	email: String,
	password: String,
	role: Number,
	image: String
});

module.exports = mongoose.model('users',UserSchema);


