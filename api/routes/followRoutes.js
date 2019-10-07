'use strict';

const express = require('express');
const followController = require('../controllers/followController');
const api = express.Router();
const constant = require('../utils/servicePoints');

const middlewareAuth = require('../middlewares/authenticate');


api.post(constant.follow,middlewareAuth.ensureAuth ,followController.saveFollow);
api.delete(constant.unFollow, middlewareAuth.ensureAuth, followController.deleteFollow);
api.get(constant.listFollows,middlewareAuth.ensureAuth, followController.getFollowingUsers);
api.get(constant.listFollowed,middlewareAuth.ensureAuth, followController.getFollowedUser);
api.get(constant.getFollows,middlewareAuth.ensureAuth, followController.getFollows);

module.exports = api;
