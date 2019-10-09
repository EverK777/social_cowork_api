'use strict';

const express = require('express');
const publicationController = require('../controllers/publicationController');
const api = express.Router();
const constant = require('../services/servicePoints');
const middlewareAuth = require('../middlewares/authenticate');
const multiPart = require('connect-multiparty');
const mdUpload = multiPart({uploadDir:'./uploads/publications'});


api.post(constant.createPublication,middlewareAuth.ensureAuth,publicationController.savePublication);
api.get(constant.getPublications,middlewareAuth.ensureAuth,publicationController.getPublications);
api.get(constant.getPublication,middlewareAuth.ensureAuth,publicationController.getPublication);


module.exports = api;