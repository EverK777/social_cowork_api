'use strict';

//const path = require('path');
//const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');
const User = require('../models/user');
const Follow = require('../models/follow');


function saveFollow(req, res) {
    const params = req.body;
    const follow = new Follow();

    follow.user = req.user.sub;
    follow.followed = params.followed;

    if(!params.followed) return res.status(200).send({message: 'Please add the id of the user to follow'});

    follow.save((err, followStore) => {
        if (err) return res.status(500).send({message: 'Error to save the follow'});

        if (!followStore) return res.status(404).send({message: 'The following was not save'});

        return res.status(200).send({follow: followStore})

    });
}

function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;

    Follow.find({'user': userId, 'followed': followId}).remove(err => {
        if (err) return res.status(500).send({message: 'Error to follow'});

        return res.status(200).send({message: 'follow deleted'});
    });
}

function getFollowingUsers(req, res) {

    const userId = getIdFromUrl(req);
    const page = getNumberOfPages(req);

    const itemsPerPage = 4;

    Follow.find({user: userId}).populate({
        path: 'followed',
        model: User
    }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'server error'});

        if (total === 0) return res.status(404).send({message: 'You are not following any body'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}

function getFollowedUser(req, res) {

    const userId = getIdFromUrl(req);
    const page = getNumberOfPages(req);

    const itemsPerPage = 4;

    Follow.find({followed: userId}).populate({
        path: 'user',
        model: User
    }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'server error'});

        if (total === 0) return res.status(404).send({message: 'No body follow this user '});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });

}

function getNumberOfPages(req) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    return page;
}

function getIdFromUrl(req) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    return userId
}

function getFollows(req, res) {
    const userId = req.user.sub;

    var find = Follow.find({user: userId});

    if (req.params.followed) {
        find = Follow.find({followed: userId});
    }

    find.populate({path: 'user followed', model: User}).exec((err, follows) => {
        if (err) return res.status(500).send({message: 'server error'});

        if (!follows) return res.status(404).send({message: 'You don not follow any user'});

        return res.status(200).send({follows});
    });
}


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getFollows
};