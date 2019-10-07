'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const constant = require('../utils/constants');
const jwt = require ('../services/jwt');
const mongoosePaginated = require('mongoose-pagination');
const fileSystem = require('fs');
const path = require('path');


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
                            userStore.password = undefined;
                            res.status(200).send({user: userStore});
                        } else {
                            res.status(404).send({message: 'UserController has not been registered'});
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
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                } else {
                    //wrong email or password
                    return res.status(404).send({message: 'Error login, check password and email'});
                }
            })
        } else {
            //user doesnt have an account
            return res.status(404).send({message: 'This user does not have an account'});

        }
    })
}

function getUser(req,res){
    const userId = req.params.id;

    User.findById(userId, (err, user) =>{
       if(err) return res.status(500).send({message : 'Request error'});

       if(!user) return res.status(404).send({message: 'The user does not exist'});
        user.password = undefined;
       return res.status(200).send({user})
    });
}

function getUsers(req, res){
    const identityUserId = req.user.sub;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    const itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
        if(err) return res.status(500).send({message : 'Request error'});

        if(!users) return res.status(404).send({message: 'There are not users available'});

        users.forEach(function(item) { item.password = undefined});
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage),

        });
    });
}

function updateUser(req, res){
    const userId = req.params.id;
    const update = req.body;

    //delete property password
    delete update.password;

    if(userId !== req.user.sub){
        return res.status(500).send({message: 'you do not have access to update this user'});
    }

    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
       if(err) return res.status(500).send({message: 'Request error'});
       
       if(!userUpdated) return res.status(404).send({message: 'The user cannot be updated'});
       
       return res.status(200).send({user: userUpdated});

    });
}

function uploadImage(req, res){
    const userId = req.params.id;

    if(req.files){
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[fileSplit.length-1];
        const extension = fileName.split('\.');
        const fileExtension = extension[1].toLowerCase();

        if(userId !== req.user.sub){
            return deletePath(filePath,res,'you do not have access to update this user')
        }

        if(fileExtension === 'png' ||
            fileExtension === 'jpg' ||
            fileExtension === 'jpeg' ||
            fileExtension === 'gif'){
            User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                if(err) return res.status(500).send({message: 'Request error'});

                if(!userUpdated) return res.status(404).send({message: 'The user cannot be updated'});

                userUpdated.password = undefined;

                return res.status(200).send({user: userUpdated});
            });

        }else {
           return deletePath(filePath,res,'Wrong image format');
        }
    }else {
       return  res.status(200).send({message: 'image could not be send'});
    }
}

function deletePath(filePath, res,message){
    fileSystem.unlink(filePath, (err)=>{
        return res.status(200).send({message:message});
    });
}

function getImageFile(req, res){
    const image_file = req.params.imageFile;
    const path_file = './uploads/users/'+image_file;

    fileSystem.stat(path_file,(err,stats)=>{
        if(err) return res.status(200).send({message:'Image does not exist'});
         return res.sendFile(path.resolve(path_file));
    });


}


module.exports = {
    home,
    pruebas,
    saveUser,
    login,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
};