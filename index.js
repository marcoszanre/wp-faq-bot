'use strict';

require('dotenv').config()

// Imports dependencies and set up http server
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const { processPost } = require('./services/postProcessor');
const { processUserMessage, processGroupMessage } = require('./services/messageProcessor');
const { processPostback } = require('./services/postbackProcessor');
const { getGroupMembers, createGroupChatThread } = require('./helper/graphAPI');
const verifyToken = process.env.VERIFY_TOKEN;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;
    // console.log(body);
    console.log(JSON.stringify(body));

    switch (body.object)
    {
      case 'page':
        // Check whether message
        if (body.entry[0].messaging[0].message)
        {
          if (body.entry[0].messaging[0].thread)
          {
            processGroupMessage(body);
          }
          else
          {
            processUserMessage(body);
          }
        }
        if (body.entry[0].messaging[0].postback)
        {
          processPostback(body);
        }
        break;
      case 'group':
        processPost(body);
        break;
      default:
        console.log(JSON.stringify(body));
        break;
    }

    res.sendStatus(200);
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = verifyToken

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
});
