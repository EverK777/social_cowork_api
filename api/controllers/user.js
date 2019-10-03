'use strict'

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const constant = require('../utils/constants');


function home(req,res){
	res.status(200).send({
		message: 'home function'
	});
}

function pruebas(req,res){
	console.log(req.body);
	res.status(200).send({
		message: 'Prueba'
	});
}

function saveUser(req, res){
	const params = req.body;
	const user = new User();

	if(params.name && params.surname && 
		params.nick && params.email && params.password){
	 	
	 	user.name = params.name;
	 	user.surname = params.surname;
	 	user.nick = params.nick;
	 	user.email = params.email;
        user.role = constant.USER_ROLE;

	 	bcrypt.hash(params.password,8,(err, hash) => {
	 		user.password = hash;

	 		user.save((err, userStore)=>{
	 			if(err) return res.status(500).send({message: 'error to save user'});

	 			if(userStore){
	 				res.status(200).send({user: userStore});
	 			}else{
	 				res.status(404).send({message:'User has not been registered'});
	 			}
	 		});
		});

	}else {
		res.status(200).send({
			message: 'Please send all the necessary field'
		});
	}
}

module.exports = {
	home,
	pruebas,
	saveUser
}