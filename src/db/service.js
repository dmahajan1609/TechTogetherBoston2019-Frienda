'use strict';

const {
    User,Conversation
} = require('./model');



class Users {

    static async save(senderId, conversation) {
      console.log('inside here')

        try {
            user = await User.findOneAndUpdate({
                senderId: senderId
            }, {
                $set: {
                    'conversations.$.userText': conversation.userText,
                    'conversations.$.botText': conversation.botText
                }
            });
        } catch (err) {
            console.log('error from findOneUser', err)
        }

        if (!user) {
            const user = new User({
                senderId: senderId
            });
            user.save().then(() => {
                const conversation = new Conversation({
                    userText: conversation.userText,
                    botText: conversation.botText,
                    _user: user._id
                });
                //console.log(user)
                conversation.save().then((conversation) => {
                    console.log(conversation._id)
                }).catch((err) => {
                    console.log(err);
                });
                user.conversations.push(conversation);
                user.save().then((user) => console.log(user)).catch((err) => console.log(err));
            }).catch((err) => {
                console.log(err);

            });
        }
    }

}

module.exports={
    Users
}