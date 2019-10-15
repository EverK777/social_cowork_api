'use strict';

const express = require('express');
const messageController = require('../controllers/messageController');
const api = express.Router();
const endPoints = require('../services/servicePoints');
const multiPart = require('connect-multiparty');
const mdUpload = multiPart({uploadDir:'./uploads/publications'});
const middlewareAuth = require('../middlewares/authenticate');


api.post(endPoints.sendMessage,middlewareAuth.ensureAuth,messageController.sendMessage);
api.get(endPoints.getReceiverMessages,middlewareAuth.ensureAuth,messageController.getReceivedMessages);
api.get(endPoints.getEmitterMessages,middlewareAuth.ensureAuth,messageController.getEmitterMessages);
api.get(endPoints.getUnViewedMessages,middlewareAuth.ensureAuth,messageController.getUnViewedMessages);
api.get(endPoints.setAllViewMessages,middlewareAuth.ensureAuth,messageController.setViewedMessages);


module.exports = api;