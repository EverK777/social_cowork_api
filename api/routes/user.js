'use strict'

const constant = require('../utils/servicePoints');

const express = require('express');
const userController = require('../controllers/user');

const api = express.Router();
const middlewareAuth = require('../middlewares/authenticate');

//user routes
api.get(constant.home, userController.home);
// prof
api.get(constant.pruebas,middlewareAuth.ensureAuth, userController.pruebas);
//register user
api.post(constant.registerUser, userController.saveUser);
//login user
api.post(constant.login, userController.login);
//get user
api.get(constant.getUser,middlewareAuth.ensureAuth , userController.getUser);

module.exports = api;