'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = require('../utils/constants').secretKey;

exports.createToken = function (user){
    const payLoad = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        image: user.image,
        nick: user.nick,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
   return  jwt.encode(payLoad, secret);
};


