'use strict'

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const constant = require('../utils/constants');


function home(req, res) {
    res.status(200).send({
        message: 'home function'
    });
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message: 'Prueba'
    });
}

function saveUser(req, res) {
    const params = req.body;
    const user = new User();
    if (params.name && params.surname &&
        params.nick && params.email && params.password) {

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = constant.USER_ROLE;


        //check duplicated users
        User.find({
            $or: [
                {email: user.email.toLowerCase()},
                {nick: user.nick.toLowerCase()}]
        }).exec((err, users) => {
            if (err) return res.status(500).send({message: "Error to user request"});
            if (users && users.length > 0) {
                res.status(200).send({message: "The user exist try with another email or nick name "});
            } else {
                // encrypt pass and save the data
                bcrypt.hash(params.password, 8, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStore) => {
                        if (err) return res.status(500).send({message: 'error to save user'});

                        if (userStore) {
                            res.status(200).send({user: userStore});
                        } else {
                            res.status(404).send({message: 'User has not been registered'});
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'Please send all the necessary field'
        });
    }
}

function login(req, res) {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    User.findOne({email: email}, (err, user) => {
        if (err) return res.status(500).send({message: 'Request error'});

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //login successfully
                    return res.status(200).send({user});
                }else {
                    //wrong email or password
                    return res.status(404).send({message: 'Error login, check password and email'});
                }
            })
        }else {
            //user doesnt have an account
            return res.status(404).send({message: 'This user does not have an account'});

        }
    })


}


module.exports = {
    home,
    pruebas,
    saveUser,
    login
}