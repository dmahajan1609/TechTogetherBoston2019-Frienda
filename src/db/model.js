'use strict';

const { model, Schema } = require('mongoose');
const logger = console;


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/conversation-bot-api',{
    useNewUrlParser:true,
    useCreateIndex:true

})

const User = new mongoose.model('User',{
    senderId: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, required: true },
    conversations : [{ type: mongoose.Schema.Types.ObjectId, ref: Conversation }]


});
const Conversation = new mongoose.model('Conversation',{
    userText: { type: String, required: true,trim:true },
    botText: { type: String, required: true,trim:true }
});


module.exports.User = model('User', User);













