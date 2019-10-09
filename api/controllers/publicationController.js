'use strict';

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose-pagination');
const moment = require('moment');

const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');


function savePublication(req,res){
    const params = req.body;
    const publication = new Publication();

    if(!params.text)return res.status(200).send({message:'Please send a text'});

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message:'Error to send publication'});
        if(!publicationStored) return(404).send({message:'Publication has not been saved'});
        return res.status(200).send({publication:publicationStored});
    });
}

function getPublications(req,res){
    let page = 1;
    if(req.params.page){
         page = req.params.page;
    }
    const itemsPerPage = 10;
    Follow.find({user: req.user.sub}).populate({path: 'followed', model: User}).exec((err, follows)=>{
        if(err) return res.status(500).send({message:'Error to return the follower'});

        const followsClean = [];

        follows.forEach(follow =>{
            followsClean.push(follow.followed);
        });


        // $in find inside of array
        Publication.find({user :{"$in": followsClean}})
            .sort('created_at')
            .populate({path: 'user', model: User})
            .paginate(page,itemsPerPage,(err,publications,total)=>{
                if(err) return res.status(500).send({message:'Error to return the publication'});

                if(!publications) return res.status(404).send({message:'There are no publications'});


                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total/itemsPerPage),
                    page: page,
                    publications: publications
                });
            });
    });
}

function getPublication(req, res){
    const publicationId = req.params.id;


    Publication.findById(publicationId, (err, publication)=>{
        if(err) return res.status(500).send({message:'Error to return the publication'});

        if(!publication) return res.status(404).send({message:'Publication was not found'});

        return  res.status(200).send({publication:publication});
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication
};


