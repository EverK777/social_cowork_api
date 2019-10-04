'use strict'

const constant = require('../utils/servicePoints');

const express = require('express');
const userController = require('../controllers/user');

const api = express.Router();

//user routes
api.get(constant.home, userController.home);
api.get(constant.pruebas, userController.pruebas);
//register user
api.post(constant.registerUser, userController.saveUser);
//login user
api.post(constant.login, userController.login);
module.exports = api;