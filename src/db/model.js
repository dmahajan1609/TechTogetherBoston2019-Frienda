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

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/conversation-bot-api',{
    useNewUrlParser:true,
    useCreateIndex:true

})

const User = mongoose.model('User',{
    name: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: null, required: false },
    conversations : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }]


});
const Conversation = mongoose.model('Conversation',{
    userText: { type: String, required: true,trim:true },
    botText: { type: String, required: true,trim:true }
});


const user = new User({name:'Fahmida Joyti'});
//const conversation = new Conversation({userText:'hello',})
user.save().then(()=>{
    const conversation = new Conversation({userText:'hello',botText:'hi!',_user:user._id});
    //console.log(user)
    conversation.save().then((conversation)=>{console.log(conversation._id)}).catch((err)=>{
        console.log(err);
    });
    user.conversations.push(conversation);
    user.save().then((user)=>console.log(user)).catch((err)=>console.log(err));
}).catch((err)=>{
    console.log(err);

});













