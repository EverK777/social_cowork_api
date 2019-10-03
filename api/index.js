'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

// connection database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cowork_network')
	.then(()=>{
		console.log("Connected succesfully to db");
		//create server
		app.listen(port, () => {
			console.log("Server is running in http://localhost:3800");
		});
	})
	.catch(err => console.log(err));

