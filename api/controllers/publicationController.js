'use strict';

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose-pagination');
const moment = require('moment');

const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');


function savePublication(req, res) {
    const params = req.body;
    const publication = new Publication();

    if (!params.text) return res.status(200).send({message: 'Please send a text'});

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({message: 'Error to send publication'});
        if (!publicationStored) return (404).send({message: 'Publication has not been saved'});
        return res.status(200).send({publication: publicationStored});
    });
}

function getPublications(req, res) {
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 10;
    Follow.find({user: req.user.sub}).populate({path: 'followed', model: User}).exec((err, follows) => {
        if (err) return res.status(500).send({message: 'Error to return the follower'});

        const followsClean = [];

        follows.forEach(follow => {
            followsClean.push(follow.followed);
        });


        // $in find inside of array
        Publication.find({user: {"$in": followsClean}})
            .sort('created_at')
            .populate({path: 'user', model: User})
            .paginate(page, itemsPerPage, (err, publications, total) => {
                if (err) return res.status(500).send({message: 'Error to return the publication'});

                if (!publications) return res.status(404).send({message: 'There are no publications'});


                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page: page,
                    publications: publications
                });
            });
    });
}

function getPublication(req, res) {
    const publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({message: 'Error to return the publication'});

        if (!publication) return res.status(404).send({message: 'Publication was not found'});

        return res.status(200).send({publication: publication});
    });
}

function deletePublication(req, res) {
    const publicationId = req.params.id;
    Publication.find({'user': req.user.sub, '_id': publicationId}).remove((err, publicationRemoved) => {
        if (err) return res.status(500).send({message: 'Error to delete the publication'});

        if (!publicationRemoved) return res.status(404).send({message: 'Publication was not removed'});

        return res.status(200).send({publication: publicationRemoved});
    });
}

function uploadImage(req, res) {
    const publicationId = req.params.id;

    if (req.files) {
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[fileSplit.length - 1];
        const extension = fileName.split('\.');
        const fileExtension = extension[1].toLowerCase();


        if (fileExtension === 'png' ||
            fileExtension === 'jpg' ||
            fileExtension === 'jpeg' ||
            fileExtension === 'gif') {
            Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {
                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, {file: fileName}, {new: true}, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({message: 'Request error'});

                        if (!publicationUpdated) return res.status(404).send({message: 'File does not upload'});

                        return res.status(200).send({publication: publicationUpdated});
                    });
                }else {
                    return _deletePath(filePath, res, 'You don not have access to update this publication');
                }
            });

        } else {
            return _deletePath(filePath, res, 'Wrong image format');
        }
    } else {
        return res.status(200).send({message: 'image could not be send'});
    }
}

function _deletePath(filePath, res, message) {
    fs.unlink(filePath, (err) => {
        return res.status(200).send({message: message});
    });
}

function getImageFile(req, res) {
    const image_file = req.params.imageFile;
    const path_file = './uploads/publications/' + image_file;

    fs.stat(path_file, (err, stats) => {
        if (err) return res.status(200).send({message: 'Image does not exist'});
        return res.sendFile(path.resolve(path_file));
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
};


