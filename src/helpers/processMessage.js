const API_AI_TOKEN = '416b44623de74aa68b37e14459e9ffdd';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAAclN4uZAyWkBADswVXA9OD29JljnHymEOnHvtblgOBRNFJApddG5ZAYrdZAHUljS48TBIH5ZCE5sk1UpRJrQPYyS26elgxWkyf4Q4ANYGgVsG9vv9uMZBQECtBlfZBqPX8H5rOYSXA7hG2Tzf1OuIMzXDiTJArr5WgJ0VsWNXElgOjMT4yuvx';
const request = require('request');
const sessionIds = new Map();
const uuid = require("uuid");
const axios = require('axios');
const {
  Users
} = require('../db/service')
const {
  save
} = require('../db/model');


const sendTextMessage = async (recipientId, text) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text
    }
  };
  await callSendAPI(messageData);
}

const callSendAPI = async (messageData) => {
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`;
  await axios.post(url, messageData)
    .then(function (response) {
      if (response.status == 200) {
        var recipientId = response.data.recipient_id;
        var messageId = response.data.message_id;
        if (messageId) {
          console.log(
            "Successfully sent message with id %s to recipient %s",
            messageId,
            recipientId
          );
        } else {
          console.log(
            "Successfully called Send API for recipient %s",
            recipientId
          );
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}


function sendToApiAi(sender, text) {
  sendTypingOn(sender);
  let apiaiRequest = apiAiClient.textRequest(text, {
    sessionId: sessionIds.get(sender)
  });

  apiaiRequest.on("response", response => {
    console.log('sendToApiAi-response', response);
    // const result = response.result.fulfillment.speech;
    if (isDefined(response.result)) {
      handleApiAiResponse(sender, response);
    }
  });

  apiaiRequest.on("error", error => console.error(error));
  apiaiRequest.end();
}


async function handleApiAiResponse(sender, response) {

  console.log('response from api', response);

  let conversation = {
    userText: response.result.resolvedQuery,
    botText: response.result.fulfillment.speech
  }
  //const user=  await Users.save(sender, conversation);
  console.log('outgoing conversation object', conversation)
  const user = await save(sender, conversation);
  console.log('invoked mongo', response);

  if (response.result.fulfillment.speech === "Sure. Here\'s your improvement graph. Great Job on the progress. Is there anything else I can help you with?") {
    sendImageMessage(sender, response.result.fulfillment.speech);
  }


  let responseText = response.result.fulfillment.speech;

  let responseData = response.result.fulfillment.data;
  let messages = response.result.fulfillment.messages;
  let action = response.result.action;
  let contexts = response.result.contexts;
  let parameters = response.result.parameters;

  sendTypingOff(sender);

  console.log('reached here');

  if (responseText == "" && !isDefined(action)) {
    //api ai could not evaluate input.
    console.log("Unknown query" + response.result.resolvedQuery);
    sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?"
    );
  } else if (isDefined(action)) {
    console.log('entered action block')
    handleApiAiAction(sender, action, responseText, contexts, parameters);
  } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
    try {
      console.log("Response as formatted message" + responseData.facebook);
      sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      console.log('throwing error', err);
      sendTextMessage(sender, err.message);
    }
  } else if (isDefined(responseText)) {
    console.log('This is being sent back', responseText);
    sendTextMessage(sender, responseText);
  }
}

const sendImageMessage = async (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "https://raw.githubusercontent.com/dmahajan1609/TechTogetherBoston2019-Frienda/master/Sentiment%20Analyzer/Plot.png"
        }
      }
    }
  };
  await callSendAPI(messageData);
}


function handleApiAiAction(sender, action, responseText, contexts, parameters) {
  switch (action) {
    case "userSentiment":
      var responseText = "I'm here to listen whenever you're ready to talk about it"
      sendTextMessage(sender, responseText);
      break;
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }
}


/*
 * Turn typing indicator off
 *
 */
const sendTypingOff = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}


const isDefined = (obj) => {
  if (typeof obj == "undefined") {
    return false;
  }
  if (!obj) {
    return false;
  }
  return obj != null;
}


/*
 * Turn typing indicator on
 *
 */
const sendTypingOn = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };
  callSendAPI(messageData);
}


module.exports = (event) => {
  console.log('processMessage-event', event);
  const senderId = event.sender.id;
  console.log()
  const messageText = event.message.text;
  const messageAttachments = event.message.attachments;
  console.log('processMessage-message', messageText);
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;

  if (!sessionIds.has(senderId)) {
    sessionIds.set(senderId, uuid.v1());
  }

  var messageId = event.message.mid;
  var appId = event.message.app_id;
  var metadata = event.message.metadata;

  if (messageText) {
    //send message to api.ai
    sendToApiAi(senderId, messageText);
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderID);
  }
};