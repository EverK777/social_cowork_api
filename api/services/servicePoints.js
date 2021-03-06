'use strict';

//users points
const home = '/01';
const registerUser = '/02';
const login = '/03';
const getUser = '/04/:id';
const getUsers = '/05/:page?';
const updateUser = '/06/:id';
const getCount = '/07/:id?';
const uploadImage = '/08/:id';
const getAvatar = '/09/:imageFile';

//follows points
const follow = '/10';
const unFollow = '/11/:id';
const listFollows = '/12/:id?/:page?';
const listFollowed = '/13/:id?/:page?';
const getFollows = '/14/:followed?';

// publications points
const createPublication = '/15';
const getPublications = '/16/:page?';
const getPublication = '/17/:id';
const deletePublication = '/18/:id';
const uploadImagePublication = '/19/:id';
const getImagePublication = '/20/:imageFile';

//messages points
const sendMessage = '/21';
const getReceiverMessages = '/22/:page?';
const getEmitterMessages = '/23/:page?';
const getUnViewedMessages = '/24';
const setAllViewMessages = '/25';

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
    listFollowed,
    getFollows,
    getCount,
    createPublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImagePublication,
    getImagePublication,
    sendMessage,
    getReceiverMessages,
    getEmitterMessages,
    getUnViewedMessages,
    setAllViewMessages
};