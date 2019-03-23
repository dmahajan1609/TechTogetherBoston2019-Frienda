'use strict';

// const { model, Schema } = require('mongoose');
// const logger = console;
//
// const ConversationSchema = new Schema({
//     userText: { type: String, required: true },
//     botText: { type: String, required: true }
//   });
//
// const User = new Schema({
//     name: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now, required: true },
//     updatedAt: { type: Date, default: null, required: false },
//     conversation: conversationSchema
//  
//   });
//  
//   module.exports.User = model('User', User);

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/conversation-bot-api',{
    useNewUrlParser:true,
    useCreateIndex:true

})

const User = mongoose.model('User',{
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: null, required: false }

});

