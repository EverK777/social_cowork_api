'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

// connection database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cowork_network',  {useNewUrlParser: true, useUnifiedTopology: true})
	.then(()=>{
		console.log("Connected successfully to mongo db");
		//create server
		app.listen(port, () => {
			console.log("Server is running in http://localhost:3800");
		});
	})
	.catch(err => console.log(err));

