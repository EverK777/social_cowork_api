'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();


//	load routes
const userRoutes = require('./routes/user');


//	modllewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//	cors

//	routes

app.use('/api', userRoutes);

// export
module.exports = app;
