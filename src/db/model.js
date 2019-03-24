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
    conversations : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }]


});
const Conversation = new mongoose.model('Conversation',{
    userText: { type: String, required: true,trim:true },
    botText: { type: String, required: true,trim:true }
});

async function  save(senderId,conversation) {
    let user;
    console.log('Conversation inside save ',conversation)
    //const user = new User({senderId: senderId});
    console.log('model user',user);
    console.log('senderid ',senderId);
//const conversation = new Conversation({userText:'hello',})
     user = await User.create(new User({senderId: senderId}));
    console.log('Await user',user);
    const conversationObject = await Conversation.create(new Conversation({userText:conversation.userText,botText: conversation.botText}));

    console.log('Await conversation',conversationObject);
    /*
    user.save().then(() => {
        //let conversation = new Conversation({userText: conversation.userText, botText: conversation.botText, _user: user._id});
        console.log('Inside conversation',conversation)
        conversation.save().then((conversation) => {
            console.log(conversation._id)
        }).catch((err) => {
            console.log(err);
        });
        */
        user.conversations.push(conversationObject);
        user = await user.save();
        //user.save().then((user) => console.log(user)).catch((err) => console.log(err));
        /*
    }).catch((err) => {
        console.log(err);

    });
    */

}
module.exports={
    User,
    Conversation,
    save
}













