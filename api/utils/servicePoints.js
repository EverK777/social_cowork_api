'use strict';

//users points
const home = '/01';
const registerUser = '/03';
const login = '/04';
const getUser = '/05/:id';
const getUsers = '/06/:page?';
const updateUser = '/07/:id';
const uploadImage = '/08/:id';
const getAvatar = '/09/:imageFile';

//follows points
const follow = '/10';
const unFollow = '/11/:id';
const listFollows = '/12/:id?/:page?';
const listFollowed = '/13/:id?/:page?';


module.exports = {
    home,
    registerUser,
    login,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getAvatar,
    follow,
    unFollow,
    listFollows,
    listFollowed

};