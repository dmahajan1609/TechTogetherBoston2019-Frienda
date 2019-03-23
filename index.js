// require('dotenv').config({ path: 'variables.env' });

// const express = require('express');
// const bodyParser = require('body-parser');

// const verifyWebhook = require('./verify-webhook');
// const messageWebhook = require('./message-webhook');

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', verifyWebhook);
// app.post('/', messageWebhook);

// app.listen(5000, () => console.log('Express server is listening on port 5000'));


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.listen(3000, () => console.log('Webhook server is listening, port 3000'));

const verificationController = require('./src/controllers/verification');
const messageWebhookController = require('./src/controllers/messageWebhook');
app.get('/', verificationController);
app.post('/', messageWebhookController);