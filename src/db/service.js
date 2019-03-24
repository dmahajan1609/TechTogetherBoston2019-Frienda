'use strict';

const {
    User,Conversation
} = require('./model');



class Users {

 static async save(senderId, conversation) {
     let user;
      console.log('inside here')

        try {
          console.log('inside try',senderId)
/*
        const user = await User.findOneAndUpdate({
                senderId: senderId
            }, {
                $set: {
                    'conversations.$.userText': conversation.userText,
                    'conversations.$.botText': conversation.botText
                }
            });
            /*
            const user = await User.findOne({senderId: senderId}).populate('conversations');
            const conversation = await Conversation.save(conversation);

            user.conversations.push(conversation);
            user.save().then((user) => console.log(user)).catch((err) => console.log(err));
            */

       user = await User.findOne({
                senderId: senderId
            }).populate('conversations');
            console.log('user value', user)
        } catch (err) {
            console.log('error from findOneUser', err)
        }

        if (user === null) {
            console.log('Inside null user')
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
                    console.log('Inside conversation save',err);
                });
                user.conversations.push(conversation);
                user.save().then((user) => console.log(user)).catch((err) => console.log('Failed to save user',err));
                return user;
            }).catch((err) => {
                console.log('Failed to save user outside',err);

            });
        }
    }

}

module.exports={
    Users
}