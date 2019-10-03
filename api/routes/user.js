'use strict'

const constant = require('../utils/servicePoints');

const express = require('express');
const userController = require('../controllers/user');

const api = express.Router();

//user routes
api.get(constant.home, userController.home);
api.get(constant.pruebas, userController.pruebas);
api.post(constant.registerUser, userController.saveUser);

module.exports = api;