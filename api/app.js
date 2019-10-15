'use strict';

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
// configure headers http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
//	routes

app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);

// export
module.exports = app;
