'use strict';

const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/user');
const Follow = require('../models/follow');
const Message = require('../models/message');


function sendMessage(req, res) {
    const params = req.body;

    if (!params.text || !params.receiver) return res.status(200).send({message: "Send the require fields"});

    const message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (!messageStored) return res.status(500).send({message: 'Error to send the message'});

        return res.status(200).send({message: messageStored});
    });

}

function getReceivedMessages(req, res) {
    const userId = req.user.sub;

    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 25;

    Message.find({receiver: userId}).populate({
        path: 'emitter',
        model: User,
        select: ['name','surname','email','nick']
    }).paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (!messages) return res.status(200).send({message: 'No conversations yet'});

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                messages: messages
            })

        });
}

function getEmitterMessages(req, res) {
    const userId = req.user.sub;

    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 25;

    Message.find({emitter: userId}).populate({
        path: 'emitter receiver',
        model: User,
        select: ['name','surname','email','nick']
    }).paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (!messages) return res.status(200).send({message: 'No conversations yet'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages: messages
        })

    });
}

function getUnViewedMessages(req,res){
    const userId = req.user.sub;

    Message.countDocuments({receiver:userId, viewed:'false'}).exec((err, count)=>{
        if (err) return res.status(500).send({message: 'Request error'});

        return res.status(200).send({
            'unViewed': count
        })
    })
}

function setViewedMessages(req, res){
    const userId = req.user.sub;

    Message.update({receiver:userId,viewed:'false'}, {viewed:'true'}, {multi: true}, (err, messagesUpdated)=>{
        if (err) return res.status(500).send({message: 'Request error'});

        return res.status(200).send({
            messages: messagesUpdated
        });

    });

}




module.exports = {
    sendMessage,
    getReceivedMessages,
    getEmitterMessages,
    getUnViewedMessages,
    setViewedMessages
};