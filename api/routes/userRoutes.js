'use strict';

const constant = require('../utils/servicePoints');

const express = require('express');
const userController = require('../controllers/userController');
const multipart = require('connect-multiparty');


const api = express.Router();
const middlewareAuth = require('../middlewares/authenticate');
const middlewareUpload = multipart({uploadDir: './uploads/users'});

//user routes
api.get(constant.home, userController.home);
//register user
api.post(constant.registerUser, userController.saveUser);
//login user
api.post(constant.login, userController.login);
//get user
api.get(constant.getUser,middlewareAuth.ensureAuth , userController.getUser);
//get users
api.get(constant.getUsers,middlewareAuth.ensureAuth , userController.getUsers);
//update user
api.put(constant.updateUser,middlewareAuth.ensureAuth, userController.updateUser);
//upload avatar
api.post(constant.uploadImage,[middlewareAuth.ensureAuth, middlewareUpload],userController.uploadImage);
//get avatar
api.get(constant.getAvatar, userController.getImageFile);

module.exports = api;