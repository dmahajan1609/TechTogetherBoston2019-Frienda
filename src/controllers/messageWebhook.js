const processMessage = require('../helpers/processMessage');
module.exports = (req, res) => {
    if (req.body.object === 'page') {
        console.log('request freom facebook', req);
        req.body.entry.forEach(entry => {
            console.log('entry', entry);
            var pageId = entry.id;
            console.log('pageId', pageId);
            var timeOfEvent = entry.time;
            console.log('timeOfEvent', timeOfEvent);
            entry.messaging.forEach(event => {

                console.log('event', event);

                if (event.message && event.message.text) {
                    processMessage(event);
                } else {
                    console.log("Webhook received unknown messagingEvent: ",event);
                }
            });
        });
    res.sendStatus(200);
    }
};