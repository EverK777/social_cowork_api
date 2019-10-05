'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = require('../utils/constants').secretKey;

    exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'The request does not have the header of authentication'});
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        const payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'Token has expired'
            });
        }

        req.user = payload;
    }catch(ex){
        return res.status(404).send({
            message: 'Wrong token'
        });
    }

    next();
};