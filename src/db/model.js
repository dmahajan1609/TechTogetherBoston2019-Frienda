'use strict';

const {
    model,
    Schema
} = require('mongoose');
const logger = console;


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/conversation-bot-api', {
    useNewUrlParser: true,
    useCreateIndex: true

})

const User = new mongoose.model('User', {
    senderId: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    }]


});
const Conversation = new mongoose.model('Conversation', {
    userText: {
        type: String,
        required: true,
        trim: true
    },
    botText: {
        type: String,
        required: true,
        trim: true
    }
});

async function save(senderId, conversation) {
    let user;
    console.log('Conversation inside save ', conversation)
    console.log('model user', user);
    console.log('senderid ', senderId);

    user = await User.findOne({
        senderId
    });
    if (!user) {
        user = await User.create(new User({
            senderId: senderId
        }));
        console.log('Await user', user);
        const conversationObject = await Conversation.create(new Conversation({
            userText: conversation.userText,
            botText: conversation.botText
        }));

        console.log('if conversation', conversationObject);
        user.conversations.push(conversationObject);
        user = await user.save();
    } else {
        const conversationObject = await Conversation.create(new Conversation({
            userText: conversation.userText,
            botText: conversation.botText
        }));

        console.log('else conversation', conversationObject);
        user.conversations.push(conversationObject);
        user = await user.save();

    }


}
module.exports = {
    User,
    Conversation,
    save
}
