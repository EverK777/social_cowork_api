'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();


//	load routes
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');


//	middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//	cors

//	routes

app.use('/api', userRoutes);
app.use('/api', followRoutes);

// export
module.exports = app;
