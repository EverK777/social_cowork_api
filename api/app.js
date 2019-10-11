'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();


//	load routes
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const messageRoutes = require('./routes/messageRoutes');


//	middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//	cors

//	routes

app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);

// export
module.exports = app;
