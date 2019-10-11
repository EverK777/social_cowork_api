'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
	emitter: { type: Schema.ObjectId, ref: 'User' },
	receiver: {type: Schema.ObjectId, ref: 'User'},
	text: String,
	created_at: String,
	viewed: String
});

module.exports = mongoose.model('Message', MessageSchema);